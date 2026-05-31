from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("app.routers.chat.client")
def test_chat(mock_client):
    mock_response = MagicMock()
    mock_response.content[0].text = "안녕하세요!"
    mock_client.messages.create.return_value = mock_response

    response = client.post("/chat/", json={"message": "안녕"})
    assert response.status_code == 200
    assert response.json()["reply"] == "안녕하세요!"
