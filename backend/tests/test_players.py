# PotionRH players API tests (POST /api/players upsert, GET /api/players/{nick})
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


@pytest.fixture
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


def _nick():
    return "T_" + uuid.uuid4().hex[:8]


class TestPlayers:
    def test_root(self, s):
        r = s.get(f"{BASE_URL}/api/")
        assert r.status_code == 200

    def test_create_strips_at_and_upsert(self, s):
        n = _nick()
        r = s.post(f"{BASE_URL}/api/players", json={"nick": "@" + n})
        assert r.status_code == 200
        d = r.json()
        assert d["nick"] == n
        assert d["avatar_url"] == f"https://unavatar.io/x/{n.lower()}"
        assert d["visits"] == 1
        assert "_id" not in d and "nick_key" not in d
        r2 = s.post(f"{BASE_URL}/api/players", json={"nick": n.lower()})
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["id"] == d["id"]
        assert d2["visits"] == 2
        assert d2["nick"] == n  # original casing preserved
        g = s.get(f"{BASE_URL}/api/players/{n.upper()}")
        assert g.status_code == 200
        assert g.json()["id"] == d["id"]
        assert g.json()["visits"] == 2

    def test_reference_testuser_1(self, s):
        r = s.post(f"{BASE_URL}/api/players", json={"nick": "@TestUser_1"})
        assert r.status_code == 200
        d = r.json()
        assert d["nick"] in ("TestUser_1", "testuser_1")
        assert d["avatar_url"] == "https://unavatar.io/x/testuser_1"
        g = s.get(f"{BASE_URL}/api/players/testuser_1")
        assert g.status_code == 200 and g.json()["id"] == d["id"]

    @pytest.mark.parametrize("bad", ["a", "bad name!", "", "@", "abcdefghijklm", "ab-cd", "ğüş"])
    def test_invalid_nick_422(self, s, bad):
        r = s.post(f"{BASE_URL}/api/players", json={"nick": bad})
        assert r.status_code == 422

    def test_missing_body_422(self, s):
        r = s.post(f"{BASE_URL}/api/players", json={})
        assert r.status_code == 422

    def test_unknown_404(self, s):
        r = s.get(f"{BASE_URL}/api/players/zz_nobody_{uuid.uuid4().hex[:4]}")
        assert r.status_code == 404

    def test_whitespace_and_12_chars(self, s):
        n = "T" + uuid.uuid4().hex[:11]
        r = s.post(f"{BASE_URL}/api/players", json={"nick": f"  @{n}  "})
        assert r.status_code == 200
        assert r.json()["nick"] == n
