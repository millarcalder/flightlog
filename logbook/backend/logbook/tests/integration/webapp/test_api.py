def test_post_flight(client, access_token):
    res = client.post(
        "/api/flight",
        json={
            "date_of_flight": "2021-01-01",
            "site_id": 1,
            "glider_id": 1,
            "start_time": "2021-01-01T12:00:00",
            "stop_time": "2021-01-01T12:30:00",
            "max_altitude": 100,
            "wind_speed": 10,
            "wind_dir": 0,
            "comments": "..."
        },
        headers={"Authorization": f"Bearer {access_token.access_token}"}
    )
    assert res.status_code == 200
    assert res.json() == {
        "id": 3,
        "user_id": 1,
        "date_of_flight": "2021-01-01",
        "site_id": 1,
        "glider_id": 1,
        "start_time": "2021-01-01T12:00:00",
        "stop_time": "2021-01-01T12:30:00",
        "max_altitude": 100,
        "wind_speed": 10,
        "wind_dir": 0,
        "comments": "...",
        "flightlog_viewer_link": None,
        "igc_s3": None
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
        "user_id": 1,
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
        "user_id": 1,
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
