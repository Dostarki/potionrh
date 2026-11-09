import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL || ""}/api/admin/login`, { password });
      onLogin(data.token);
    } catch (err) {
      toast.error(typeof err.response?.data?.detail === "string" ? err.response.data.detail : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="pixel-card login-card" onSubmit={submit} data-testid="admin-login-form">
      <label className="pixel-label" htmlFor="admin-password">ADMIN PASSWORD</label>
      <input
        id="admin-password"
        data-testid="admin-password-input"
        className="pixel-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <button className="pixel-btn" type="submit" disabled={busy} data-testid="admin-login-submit">
        {busy ? "CHECKING..." : "ENTER"}
      </button>
    </form>
  );
};
