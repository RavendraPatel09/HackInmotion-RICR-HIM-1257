import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_civic_journey():
    # 1. Register a new citizen
    random_id = uuid.uuid4().hex[:6]
    email = f"user_{random_id}@nagarsathi.com"
    reg_response = client.post("/api/auth/register", json={
        "name": "Test Citizen",
        "email": email,
        "password": "testpassword",
        "role": "citizen",
        "phone": "+91 99999 88888",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    })
    print("REGISTRATION RESPONSE DETAIL:", reg_response.json())
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    token = reg_data["access_token"]
    citizen_headers = {"Authorization": f"Bearer {token}"}

    # 2. File a civic report
    report_response = client.post("/api/reports", json={
        "title": "Broken Pothole on Ward Street",
        "description": "Deep waterlogged pothole causing major vehicle damage and traffic safety issues.",
        "category": "roads-potholes",
        "priority": "High",
        "lat": 23.2505,
        "lng": 77.4182,
        "address": "Ward 2 Area, Bhopal, MP",
        "state": "Madhya Pradesh",
        "district": "Bhopal District",
        "city": "Bhopal",
        "wardId": "bpl-ward-02",
        "wardName": "Zone II — Arera Colony",
        "photoUrl": "https://images.unsplash.com/photo-1515162305285-0293e4767cc2",
        "isAnonymous": False
    }, headers=citizen_headers)
    assert report_response.status_code == 201
    report = report_response.json()
    report_id = report["id"]
    tracking_id = report["trackingId"]
    assert tracking_id.startswith("NGR-2026-")
    assert report["status"] == "Reported"

    # 3. Add a comment
    comment_response = client.post(f"/api/reports/{report_id}/comments", json={
        "id": "", "issue_id": "", "author_id": "", "author_name": "", "author_role": "", "created_at": "",
        "text": "This pothole has been active for over two weeks now."
    }, headers=citizen_headers)
    assert comment_response.status_code == 200
    assert comment_response.json()["text"] == "This pothole has been active for over two weeks now."

    # 4. Another user upvotes the report
    login_admin_response = client.post("/api/auth/login", json={
        "email": "admin@nagarsathi.demo",
        "password": "password123"
    })
    assert login_admin_response.status_code == 200
    admin_token = login_admin_response.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    upvote_response = client.post(f"/api/reports/{report_id}/vote", headers=admin_headers)
    assert upvote_response.status_code == 200
    assert "usr-admin-demo" in upvote_response.json()["upvotedBy"]

    # 5. Admin updates status to In Progress
    status_ip_response = client.put(f"/api/reports/{report_id}/status", json={
        "status": "In Progress",
        "note": "Work order dispatched for asphalt mix.",
        "resolutionPhotoUrl": None
    }, headers=admin_headers)
    assert status_ip_response.status_code == 200
    assert status_ip_response.json()["status"] == "In Progress"

    # 6. Admin resolves the issue
    status_res_response = client.put(f"/api/reports/{report_id}/status", json={
        "status": "Resolved",
        "note": "Road repaved and inspected by ward engineer.",
        "resolutionPhotoUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd"
    }, headers=admin_headers)
    assert status_res_response.status_code == 200
    res_data = status_res_response.json()
    assert res_data["status"] == "Resolved"
    assert res_data["resolutionNotes"] == "Road repaved and inspected by ward engineer."

    # 7. Citizen confirms and verifies the resolution
    verify_response = client.put(f"/api/reports/{report_id}/status", json={
        "status": "Verified",
        "note": "Verified fixed. Thank you for resolving it!",
        "resolutionPhotoUrl": None
    }, headers=citizen_headers)
    assert verify_response.status_code == 200
    assert verify_response.json()["status"] == "Verified"

    # 8. Citizen submits satisfaction feedback
    satisfaction_response = client.post(f"/api/reports/{report_id}/satisfaction", json={
        "rating": 5,
        "comment": "Outstanding support and fast resolution."
    }, headers=citizen_headers)
    assert satisfaction_response.status_code == 200
    assert satisfaction_response.json()["satisfactionRating"] == 5

    # 9. Verify the transparency scoreboard updates
    trans_response = client.get("/api/transparency")
    assert trans_response.status_code == 200
    scoreboard = trans_response.json()
    assert len(scoreboard) > 0
