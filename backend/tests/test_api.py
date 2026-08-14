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

def test_rbac_and_status_transitions():
    # Login citizen
    cit_res = client.post("/api/auth/login", json={
        "email": "citizen@nagarsathi.demo",
        "password": "password123"
    })
    assert cit_res.status_code == 200
    cit_token = cit_res.json()["access_token"]
    cit_headers = {"Authorization": f"Bearer {cit_token}"}

    # Login admin
    adm_res = client.post("/api/auth/login", json={
        "email": "admin@nagarsathi.demo",
        "password": "password123"
    })
    assert adm_res.status_code == 200
    adm_token = adm_res.json()["access_token"]
    adm_headers = {"Authorization": f"Bearer {adm_token}"}

    # 1. Unauthenticated status update should return 401
    res = client.put("/api/reports/iss-bpl-01/status", json={"status": "Resolved"})
    assert res.status_code == 401

    # 2. Citizen trying to set status of their own report to "In Progress" should return 403
    res = client.put("/api/reports/iss-bpl-01/status", json={"status": "In Progress"}, headers=cit_headers)
    assert res.status_code == 403

    # 3. Citizen trying to set status of another user's report should return 403
    # Create a report as admin
    rep_res = client.post("/api/reports", json={
        "title": "Road Blocked",
        "description": "Tree fallen on road",
        "category": "roads-potholes",
        "priority": "Medium",
        "lat": 23.2599,
        "lng": 77.4126,
        "address": "Arera Colony",
        "state": "Madhya Pradesh",
        "district": "Bhopal",
        "city": "Bhopal",
        "wardId": "ward-01",
        "wardName": "Ward 1",
        "photoUrl": None,
        "isAnonymous": False
    }, headers=adm_headers)
    assert rep_res.status_code == 201
    new_report_id = rep_res.json()["id"]

    # Citizen tries to update this admin report -> should return 403
    res = client.put(f"/api/reports/{new_report_id}/status", json={"status": "Verified"}, headers=cit_headers)
    assert res.status_code == 403

    # 4. Admin updates the new report status to "Resolved" -> should succeed
    res = client.put(f"/api/reports/{new_report_id}/status", json={"status": "Resolved", "note": "Resolved successfully"}, headers=adm_headers)
    assert res.status_code == 200

    # 5. Admin trying to set status to "Verified" (which is citizen-only) should return 403
    res = client.put(f"/api/reports/{new_report_id}/status", json={"status": "Verified"}, headers=adm_headers)
    assert res.status_code == 403
