-- messages 테이블
CREATE TABLE IF NOT EXISTS messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 본인 메시지만 조회/삽입 가능
CREATE POLICY "own_messages_select" ON messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own_messages_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
