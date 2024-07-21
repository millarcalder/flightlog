def test_post_flight(client, access_token):
    res = client.post(
        "/api/flight",
        json={
            "dateOfFlight": "2021-01-01",
            "siteId": 1,
            "gliderId": 1,
            "startTime": "2021-01-01T12:00:00",
            "stopTime": "2021-01-01T12:30:00",
            "maxAltitude": 100,
            "windSpeed": 10,
            "windDir": 12.23,
            "comments": "..."
        },
        headers={"Authorization": f"Bearer {access_token.access_token}"}
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "userId": 1,
        "dateOfFlight": "2021-01-01",
        "siteId": 1,
        "gliderId": 1,
        "startTime": "2021-01-01T12:00:00",
        "stopTime": "2021-01-01T12:30:00",
        "maxAltitude": 100,
        "windSpeed": 10,
        "windDir": 12.23,
        "comments": "...",
        "flightlogViewerLink": None,
        "igcS3": None
    }

def test_post_glider(client, access_token):
    res = client.post(
        "/api/glider",
        json={
            "model": "FOO",
            "manufacturer": "BAR",
            "rating": "Z"
        },
        headers={"Authorization": f"Bearer {access_token.access_token}"}
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "userId": 1,
        "model": "FOO",
        "manufacturer": "BAR",
        "rating": "Z"
    }

def test_post_glider(client, access_token):
    res = client.post(
        "/api/glider",
        json={
            "model": "FOO",
            "manufacturer": "BAR",
            "rating": "Z"
        },
        headers={"Authorization": f"Bearer {access_token.access_token}"}
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "userId": 1,
        "model": "FOO",
        "manufacturer": "BAR",
        "rating": "Z"
    }

def test_post_site(client, access_token):
    res = client.post(
        "/api/site",
        json={
            "name": "FOO",
            "description": "BAR",
            "latitude": 12.34,
            "longitude": 123.45,
            "altitude": 100,
            "country": "Pandora"
        },
        headers={"Authorization": f"Bearer {access_token.access_token}"}
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 4,
        "name": "FOO",
        "description": "BAR",
        "latitude": 12.34,
        "longitude": 123.45,
        "altitude": 100,
        "country": "Pandora"
    }
