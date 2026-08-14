from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"

def test_auth_login_unauthorized():
    response = client.post("/api/auth/login", json={
        "email": "wrong@user.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_auth_login_success():
    response = client.post("/api/auth/login", json={
        "email": "citizen@nagarsathi.demo",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "citizen@nagarsathi.demo"

def test_get_transparency_scoreboard():
    response = client.get("/api/transparency")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "transparencyScore" in data[0]

def test_list_reports():
    response = client.get("/api/reports")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "trackingId" in data[0]
