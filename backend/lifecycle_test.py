"""Alert lifecycle verification: resolution closes alerts; stale alerts get swept."""
import httpx

BASE = "http://127.0.0.1:8000/api/v1"
SECRET = {"X-Admin-Secret": "sih-demo-admin-secret"}

with httpx.Client(timeout=30) as c:
    # 1. current active alerts
    active = c.get(f"{BASE}/alerts").json()
    print(f"1. active alerts: {[a['id'] for a in active]}")
    assert active, "need at least one alert to test with"

    target_alert = active[0]
    event_id = target_alert["eventId"]
    print(f"   newest alert message head: {target_alert['message'][:140]}")

    # 2. resolve the incident behind it
    r = c.post(
        f"{BASE}/admin/incidents/{event_id}/status",
        headers=SECRET,
        json={"new_status": "RESOLVED", "reason": "Disaster ended - verified by field team"},
    )
    print(f"2. resolve {event_id}: HTTP {r.status_code} -> status={r.json().get('status')}")

    # 3. alert should vanish from the public feed
    after = c.get(f"{BASE}/alerts").json()
    gone = all(a["id"] != target_alert["id"] for a in after)
    print(f"3. alert removed from feed after resolution: {'PASS' if gone else 'FAIL'}")

    # 4. inject an already-expired ACTIVE alert
    from datetime import datetime, timedelta, timezone

    from app.database import SessionLocal
    from app.models import Alert, Incident
    from sqlalchemy import select

    with SessionLocal() as db:
        inc = db.scalar(
            select(Incident).where(
                Incident.status.in_(("DETECTED", "UNDER_REVIEW", "VERIFIED", "ACTIVE"))
            )
        )
        db.add(Alert(
            public_id="ALT-STALE-TEST",
            incident_id=inc.id,
            alert_type="risk_high",
            title="STALE TEST ALERT",
            message="should be swept",
            severity="high",
            affected_area="Test zone",
            recommended_action="n/a",
            status="ACTIVE",
            expires_at=datetime.now(timezone.utc) - timedelta(hours=2),
        ))
        db.commit()
    print("4. injected stale ACTIVE alert (expires_at = 2h ago)")

    # 5. run detection+expiry pass
    r = c.post(f"{BASE}/admin/pipeline/trigger?ingest=false", headers=SECRET)
    print(f"5. trigger?ingest=false: {r.json()}")

    # 6. stale alert must be gone from the feed
    final = c.get(f"{BASE}/alerts").json()
    swept = all(a["id"] != "ALT-STALE-TEST" for a in final)
    print(f"6. stale alert swept from public feed: {'PASS' if swept else 'FAIL'}")

print("LIFECYCLE TEST COMPLETE")
