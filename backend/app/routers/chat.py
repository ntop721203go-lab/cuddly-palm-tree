from fastapi import APIRouter, Header
from pydantic import BaseModel
import os

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    reply: str


def _mock_reply(message: str) -> str:
    return f"[Mock] 메시지 수신: '{message}' — API 키 설정 후 실제 응답이 반환됩니다."


def _real_reply(message: str, history: list[dict]) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    messages = history + [{"role": "user", "content": message}]
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=messages,
        )
        return response.content[0].text
    except anthropic.AuthenticationError:
        return "⚠️ API 키가 유효하지 않습니다. 설정을 확인해주세요."
    except anthropic.BadRequestError as e:
        if "credit balance" in str(e).lower():
            return "⚠️ API 크레딧이 부족합니다. console.anthropic.com에서 충전 후 다시 시도해주세요."
        return f"⚠️ 요청 오류: {e}"
    except Exception as e:
        return f"⚠️ 일시적 오류가 발생했습니다. 잠시 후 다시 시도해주세요. ({type(e).__name__})"


def _get_user_id(token: str) -> str | None:
    if not token.startswith("Bearer "):
        return None
    try:
        from app.supabase import get_supabase
        user = get_supabase().auth.get_user(token.split(" ", 1)[1])
        return user.user.id if user.user else None
    except Exception:
        return None


def _save_messages(user_id: str, user_msg: str, assistant_msg: str) -> None:
    try:
        from app.supabase import get_supabase
        get_supabase().table("messages").insert([
            {"user_id": user_id, "role": "user",      "content": user_msg},
            {"user_id": user_id, "role": "assistant",  "content": assistant_msg},
        ]).execute()
    except Exception as e:
        print(f"[DB] 메시지 저장 실패: {e}")


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest, authorization: str = Header(default="")):
    use_mock = not os.getenv("ANTHROPIC_API_KEY") or os.getenv("USE_MOCK") == "true"
    reply = _mock_reply(req.message) if use_mock else _real_reply(req.message, req.history)

    user_id = _get_user_id(authorization)
    if user_id:
        _save_messages(user_id, req.message, reply)

    return ChatResponse(reply=reply)
