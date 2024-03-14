from fastapi.testclient import TestClient

from logbook.webapp.app import init_app


def test_health_check():
    app = init_app()
    client = TestClient(app)
    res = client.get('/health')
    assert res.status_code == 200
    assert res.json() == {}
