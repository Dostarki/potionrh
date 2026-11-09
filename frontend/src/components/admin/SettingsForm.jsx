import { useState } from "react";
import { toast } from "sonner";

const FIELDS = [
  { key: "follow_url", label: "Block 1 · FOLLOW X", hint: "Opens when the player hits the first block (grows the hero)" },
  { key: "rt_url", label: "Block 2 · RT", hint: "Post to repost (white plumber outfit)" },
  { key: "like_url", label: "Block 3 · LIKE", hint: "Post to like (HD potion in hand)" },
  { key: "share_url", label: "Block 4 · SHARE – quoted post", hint: "This post link is appended to the share text (WL paper)" },
];

export const SettingsForm = ({ initial, onSave }) => {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await onSave(values); }
    catch (err) { toast.error("Could not save settings"); }
    finally { setBusy(false); }
  };

  return (
    <form className="pixel-card" onSubmit={submit} data-testid="settings-form">
      <h2 className="pixel-h2">X quest links</h2>
      {FIELDS.map((f) => (
        <div className="field" key={f.key}>
          <label className="pixel-label" htmlFor={f.key}>{f.label}</label>
          <input id={f.key} data-testid={`setting-${f.key}`} className="pixel-input" type="url" value={values[f.key]} onChange={set(f.key)} required />
          <p className="hint">{f.hint}</p>
        </div>
      ))}
      <div className="field">
        <label className="pixel-label" htmlFor="share_text">Share text</label>
        <textarea id="share_text" data-testid="setting-share_text" className="pixel-input" rows={2} value={values.share_text} onChange={set("share_text")} required />
        <p className="hint">Preview: {values.share_text} {values.share_url}</p>
      </div>
      <button className="pixel-btn" type="submit" disabled={busy} data-testid="settings-save">{busy ? "SAVING..." : "SAVE"}</button>
    </form>
  );
};
