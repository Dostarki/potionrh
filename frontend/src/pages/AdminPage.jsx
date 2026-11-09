import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PlayersTable } from "@/components/admin/PlayersTable";

const API = process.env.REACT_APP_BACKEND_URL || "";
const TOKEN_KEY = "potionrh_admin_token";

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [settings, setSettings] = useState(null);
  const [players, setPlayers] = useState([]);
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(""); setSettings(null); setPlayers([]); };

  useEffect(() => {
    if (!token) return;
    Promise.all([axios.get(`${API}/api/admin/me`, auth), axios.get(`${API}/api/settings`), axios.get(`${API}/api/admin/players`, auth)])
      .then(([, s, p]) => { setSettings(s.data); setPlayers(p.data); })
      .catch(() => { logout(); toast.error("Session expired, please log in again"); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onLogin = (t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t); };
  const onSave = async (values) => {
    const { data } = await axios.put(`${API}/api/admin/settings`, values, auth);
    setSettings(data);
    toast.success("Quest links saved");
  };

  return (
    <div className="admin-shell" data-testid="admin-page">
      <header className="admin-head">
        <div>
          <p className="admin-kicker">POTIONRH</p>
          <h1 className="admin-title">Quest Control</h1>
        </div>
        {token && <button className="pixel-btn ghost" data-testid="admin-logout" onClick={logout}>Log out</button>}
      </header>
      {!token ? (
        <AdminLogin onLogin={onLogin} />
      ) : (
        <div className="admin-grid">
          {settings && <SettingsForm initial={settings} onSave={onSave} />}
          <PlayersTable players={players} />
        </div>
      )}
    </div>
  );
}
