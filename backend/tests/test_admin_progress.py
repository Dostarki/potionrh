# PotionRH: settings, admin auth/settings/players, player progress PATCH tests
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
PWD = os.environ.get("ADMIN_PASSWORD")
FIELDS = ["follow_url", "rt_url", "like_url", "share_url", "share_text"]


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/admin/login", json={"password": PWD})
    if r.status_code != 200:
        pytest.skip("admin login failed")
    return r.json()["token"]


def H(t):
    return {"Authorization": f"Bearer {t}"}


def _nick():
    return "T_" + uuid.uuid4().hex[:8]


# Public settings
def test_settings_fields():
    r = requests.get(f"{BASE_URL}/api/settings")
    assert r.status_code == 200
    d = r.json()
    for f in FIELDS:
        assert isinstance(d[f], str) and d[f]


# Admin login
def test_login_wrong():
    r = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "nope_wrong"})
    assert r.status_code == 401


def test_login_ok(token):
    assert isinstance(token, str) and len(token) > 20
    r = requests.get(f"{BASE_URL}/api/admin/me", headers=H(token))
    assert r.status_code == 200 and r.json()["role"] == "admin"


def test_bad_token():
    r = requests.get(f"{BASE_URL}/api/admin/players", headers=H("garbage.token.x"))
    assert r.status_code == 401


# Admin settings update + restore
def test_put_settings(token):
    orig = requests.get(f"{BASE_URL}/api/settings").json()
    r = requests.put(f"{BASE_URL}/api/admin/settings", json=orig)
    assert r.status_code in (401, 403)
    new = {**orig, "rt_url": "https://x.com/potionrh/status/TEST_999"}
    try:
        r = requests.put(f"{BASE_URL}/api/admin/settings", json=new, headers=H(token))
        assert r.status_code == 200
        assert r.json()["rt_url"] == new["rt_url"]
        g = requests.get(f"{BASE_URL}/api/settings").json()
        assert g["rt_url"] == new["rt_url"]
        assert g["follow_url"] == orig["follow_url"]
    finally:
        rr = requests.put(f"{BASE_URL}/api/admin/settings", json=orig, headers=H(token))
        assert rr.status_code == 200
    assert requests.get(f"{BASE_URL}/api/settings").json() == orig


def test_put_settings_missing_field(token):
    r = requests.put(f"{BASE_URL}/api/admin/settings", json={"rt_url": "x"}, headers=H(token))
    assert r.status_code == 422


# Admin players
def test_admin_players(token):
    n = _nick()
    requests.post(f"{BASE_URL}/api/players", json={"nick": n})
    assert requests.get(f"{BASE_URL}/api/admin/players").status_code in (401, 403)
    r = requests.get(f"{BASE_URL}/api/admin/players", headers=H(token))
    assert r.status_code == 200
    lst = r.json()
    assert isinstance(lst, list) and lst
    me = [p for p in lst if p["nick"] == n]
    assert me and me[0]["progress"] == {"follow": False, "rt": False, "like": False, "share": False}
    assert all("_id" not in p and "progress" in p for p in lst)


# Progress PATCH
def test_progress_patch_merge():
    n = _nick()
    d = requests.post(f"{BASE_URL}/api/players", json={"nick": n}).json()
    assert d["progress"] == {"follow": False, "rt": False, "like": False, "share": False}
    r = requests.patch(f"{BASE_URL}/api/players/{n}/progress", json={"like": True})
    assert r.status_code == 200
    assert r.json()["progress"] == {"follow": False, "rt": False, "like": True, "share": False}
    r = requests.patch(f"{BASE_URL}/api/players/{n.upper()}/progress", json={"follow": True, "like": False})
    assert r.json()["progress"] == {"follow": True, "rt": False, "like": True, "share": False}
    r = requests.patch(f"{BASE_URL}/api/players/{n}/progress", json={})
    assert r.status_code == 200 and r.json()["progress"]["like"] is True
    g = requests.get(f"{BASE_URL}/api/players/{n}").json()
    assert g["progress"] == {"follow": True, "rt": False, "like": True, "share": False}
    # re-register keeps progress, increments visits
    d2 = requests.post(f"{BASE_URL}/api/players", json={"nick": n}).json()
    assert d2["visits"] == 2 and d2["progress"]["like"] is True


def test_progress_unknown_404():
    r = requests.patch(f"{BASE_URL}/api/players/zz_none_{uuid.uuid4().hex[:4]}/progress", json={"like": True})
    assert r.status_code == 404
    r = requests.patch(f"{BASE_URL}/api/players/zz_none_{uuid.uuid4().hex[:4]}/progress", json={})
    assert r.status_code == 404
