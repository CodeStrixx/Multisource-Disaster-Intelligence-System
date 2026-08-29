"""Quick end-to-end API smoke test (run with server up on :8000)."""
import json

import httpx

BASE = "http://127.0.0.1:8000/api/v1"
SECRET = {"X-Admin-Secret": "sih-demo-admin-secret"}

with httpx.Client(timeout=30) as c:
    print("== POST /reports ==")
    r = c.post(f"{BASE}/reports", json={
        "userName": "Test Citizen",
        "type": "flood",
        "description": "Waterlogging near test junction, knee-deep water on road.",
        "lat": 23.03, "lng": 72.56,
        "locationName": "Test Junction, Ahmedabad",
    })
    print(r.status_code, json.dumps(r.json(), indent=1)[:400])

    print("== GET /incidents (flood) ==")
    r = c.get(f"{BASE}/incidents", params={"type": "flood"})
    floods = r.json()
    target = floods[0]["id"]
    print("target:", target, "| verification:", floods[0]["verificationStatus"], "| status:", floods[0]["status"])

    print("== POST /admin/incidents/{id}/verification verify ==")
    r = c.post(f"{BASE}/admin/incidents/{target}/verification",
               headers=SECRET,
               json={"action": "verify", "reason": "Confirmed via field check"})
    print(r.status_code)
    body = r.json()
    print("verificationStatus:", body.get("verificationStatus"), "| status:", body.get("status"))

    print("== POST /admin/resources create ==")
    r = c.post(f"{BASE}/admin/resources", headers=SECRET, json={
        "name": "Test Relief Camp", "type": "shelter",
        "latitude": 23.02, "longitude": 72.57,
        "address": "Test addr", "district": "Ahmedabad", "state": "Gujarat",
        "contact_number": "1800-000-000", "capacity": "500 persons",
        "availability_status": "OPEN",
    })
    print(r.status_code, r.json().get("id"), r.json().get("name"))

    new_id = r.json().get("id")
    print("== PATCH admin resource status ==")
    r = c.patch(f"{BASE}/admin/resources/{new_id}", headers=SECRET,
                json={"availability_status": "FULL"})
    print(r.status_code, "->", r.json().get("status"))

    print("== illegal transition guard ==")
    r = c.post(f"{BASE}/admin/incidents/{target}/status", headers=SECRET,
               json={"new_status": "DETECTED", "reason": "bad flow test"})
    print(r.status_code, r.json().get("detail", "")[:120])

    print("== evidence bundle ==")
    r = c.get(f"{BASE}/incidents/{target}/evidence")
    ev = r.json()
    print("evidence count:", len(ev["evidence"]), "| history:", len(ev["status_history"]),
          "| assessments:", len(ev["risk_assessments"]))

    print("== invalid coords guard (EC4) ==")
    r = c.post(f"{BASE}/reports", json={
        "userName": "X", "type": "flood", "description": "invalid coords test here",
        "lat": 999, "lng": 72.5,
    })
    print(r.status_code)

print("SMOKE TEST COMPLETE")
