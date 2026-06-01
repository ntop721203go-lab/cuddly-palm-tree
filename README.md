# AI 비서 프로젝트

Next.js + FastAPI + Supabase + LM Studio를 활용한 풀스택 AI 채팅 애플리케이션

## 빠른 시작

### 1. LM Studio 실행
1. LM Studio 실행
2. `↔ Local Server` 탭 클릭
3. 모델 선택 (Gemma 4, Qwen 등)
4. **Start Server** 클릭 (포트 1234)

### 2. 개발 서버 시작
```bash
# Windows
start-dev.bat

# 또는 수동 실행
cd backend
USE_LM_STUDIO=true .venv/Scripts/uvicorn main:app --port 8000

cd frontend
npm run dev
```

### 3. 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 4. 종료
```bash
stop-dev.bat
```

---

## 환경 변수

### 백엔드 (`.env`)
```env
# Supabase
SUPABASE_URL=https://vdzyqqhluvaiiiczjrho.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI 모델 설정 (하나만 활성화)
USE_LM_STUDIO=true                          # LM Studio 사용
LM_STUDIO_URL=http://localhost:1234/v1
LM_STUDIO_MODEL=google/gemma-4-e4b

# ANTHROPIC_API_KEY=sk-ant-api03-...       # Anthropic API 사용 (크레딧 필요)
```

### 프론트엔드 (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://vdzyqqhluvaiiiczjrho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 배포

### Vercel 배포
```bash
# 프론트엔드
cd frontend
vercel --prod

# 백엔드
cd backend
vercel --prod
```

**현재 배포된 사이트:**
- 프론트엔드: https://frontend-nine-liart-88.vercel.app
- 백엔드: https://backend-navy-sigma-39.vercel.app

---

## 프로젝트 구조

```
ai-assistant/
├── frontend/              # Next.js 15 App Router
│   ├── app/
│   │   ├── (auth)/       # 로그인/회원가입
│   │   ├── page.tsx      # 메인 채팅
│   │   └── api/          # API 프록시
│   ├── components/        # React 컴포넌트
│   └── lib/              # 유틸리티
│
├── backend/              # FastAPI
│   ├── app/
│   │   ├── routers/      # API 엔드포인트
│   │   └── supabase.py   # DB 연결
│   ├── main.py           # FastAPI 앱
│   └── requirements.txt
│
├── start-dev.bat         # 개발 서버 시작
└── stop-dev.bat          # 개발 서버 종료
```

---

## 기능

- ✅ 이메일/비밀번호 인증 (Supabase Auth)
- ✅ 실시간 채팅 UI
- ✅ 채팅 히스토리 DB 저장/로드
- ✅ LM Studio 로컬 모델 지원 (무료)
- ✅ Anthropic Claude API 지원 (유료)
- ✅ Row Level Security (RLS)
- ✅ Vercel 배포

---

## 문제 해결

### LM Studio 연결 실패
```bash
# LM Studio가 실행 중인지 확인
curl http://localhost:1234/v1/models
```

### 포트 충돌
```bash
# 포트 8000 사용 중인 프로세스 확인
netstat -ano | findstr :8000

# 프로세스 종료
taskkill /PID <PID> /F
```

### 패키지 재설치
```bash
# 백엔드
cd backend
.venv/Scripts/pip install -r requirements.txt

# 프론트엔드
cd frontend
npm install
```

---

## 기술 스택

- **Frontend:** Next.js 15, React, Tailwind CSS, Zustand
- **Backend:** FastAPI, Python 3.11
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude API, LM Studio (OpenAI 호환)
- **Deploy:** Vercel (Serverless)
- **Auth:** Supabase Auth (JWT)
