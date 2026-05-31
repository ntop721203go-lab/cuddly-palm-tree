# CLAUDE.md — AI 비서 프로젝트

## 프로젝트 개요

- **프로젝트명**: AI 비서
- **목적**: AI 기반 개인 비서 서비스
- **스택**: Next.js (React) + FastAPI (Python) + Node.js (Express)
- **배포 환경**: Vercel
- **주요 외부 서비스**: Supabase, Anthropic Claude API

---

## 디렉토리 구조

```
/
├── frontend/        # Next.js (App Router) + Tailwind + Zustand
├── backend/         # FastAPI (Python) — AI 처리, Supabase 연동
├── api/             # Node.js + Express — 미들웨어, 웹훅
├── docs/
│   └── retros/
└── CLAUDE.md
```

---

## 개발 서버 실행

```bash
# Frontend
cd frontend && npm run dev          # http://localhost:3000

# Backend
cd backend && uvicorn main:app --reload   # http://localhost:8000

# API
cd api && npm run dev               # http://localhost:4000
```

---

## 기술 스택 규칙

### Frontend (Next.js / React)
- App Router 사용, pages/ 디렉토리 사용 금지
- 스타일: Tailwind CSS
- 상태 관리: Zustand (`store/` 하위)
- 컴포넌트: `components/` 하위에 기능별 분리
- 편집 후 반드시 실행: `tsc --noEmit`

### Backend (FastAPI / Python)
- 가상환경: venv 사용 (`python -m venv .venv`)
- 엔드포인트 추가 시 타입 힌트 + Pydantic 모델 필수
- 라우터는 `app/routers/` 하위에 기능별 분리
- 편집 후 반드시 실행: `python -m pytest`

### API (Node.js / Express)
- 미들웨어 수정은 명시적 승인 없이 금지
- 편집 후 반드시 실행: `npm run lint && npm test`

---

## 절대 금지 규칙

- 인증(Supabase Auth) 로직 — 명시적 승인 없이 수정 금지
- Anthropic API 키 — 코드에 하드코딩 절대 금지
- DB 마이그레이션 — 명시적 승인 없이 실행 금지
- `.env` 파일 직접 수정 금지 (`.env.example`만 수정)

---

## 완료 전 검증 규칙

```bash
cd frontend && tsc --noEmit
cd backend && python -m pytest
cd api && npm run lint && npm test
```

---

## 커밋 규칙

- 커밋당 수정사항 하나 (원자적 커밋)
- 형식: `[type] 한 줄 설명` (feat / fix / refactor / docs / test / chore)

---

*마지막 업데이트: 2026-05-31*
