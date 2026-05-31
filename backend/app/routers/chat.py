from fastapi import APIRouter
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
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=messages,
    )
    return response.content[0].text


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    use_mock = not os.getenv("ANTHROPIC_API_KEY") or os.getenv("USE_MOCK") == "true"
    reply = _mock_reply(req.message) if use_mock else _real_reply(req.message, req.history)
    return ChatResponse(reply=reply)
