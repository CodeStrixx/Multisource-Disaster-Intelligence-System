"""Community verification test: 10 upvotes => report auto-VERIFIED."""
import httpx

with httpx.Client(timeout=30) as c:
    r = c.post("http://127.0.0.1:8000/api/v1/reports", json={
        "userName": "Upvote Tester",
        "type": "flood",
        "description": "Community verification test report near riverbank.",
        "lat": 26.15, "lng": 91.75,
        "locationName": "Test Ghat, Guwahati",
    })
    assert r.status_code == 201, r.text
    rep = r.json()
    rid = rep["id"]
    print(f"created {rid}: status={rep['verificationStatus']} upvotes={rep['upvotes']}")

    for i in range(1, 11):
        body = c.post(f"http://127.0.0.1:8000/api/v1/reports/{rid}/upvote").json()
        marker = " <== JUST VERIFIED" if body.get("justVerified") else ""
        print(f"upvote {i:2d}: upvotes={body['upvotes']:2d} status={body['verificationStatus']}{marker}")

    lst = c.get("http://127.0.0.1:8000/api/v1/reports").json()
    me = next(x for x in lst if x["id"] == rid)
    print(f"final: status={me['verificationStatus']} confidence={me['confidenceScore']}")

print("UPVOTE RULE TEST COMPLETE")
