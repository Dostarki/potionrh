const QUESTS = ["follow", "rt", "like", "share"];

export const PlayersTable = ({ players }) => (
  <section className="pixel-card" data-testid="players-table">
    <h2 className="pixel-h2">Players <span className="count">{players.length}</span></h2>
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Player</th><th>EVM address</th><th>Ref code</th><th>Invited by</th><th>Points</th><th>Visits</th>{QUESTS.map((q) => <th key={q}>{q.toUpperCase()}</th>)}<th>Last seen</th></tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} data-testid={`player-row-${p.nick.toLowerCase()}`}>
              <td className="player-cell">
                <img src={p.avatar_url} alt="" width={28} height={28} loading="lazy" />
                <a href={`https://x.com/${p.nick}`} target="_blank" rel="noreferrer">@{p.nick}</a>
              </td>
              <td className="muted evm-cell" data-testid={`player-evm-${p.nick.toLowerCase()}`} title={p.evm_address || ""}>{p.evm_address || "—"}</td>
              <td data-testid={`player-ref-${p.nick.toLowerCase()}`}>{p.ref_code || "—"}</td>
              <td className="muted">{p.referred_by || "—"}</td>
              <td data-testid={`player-points-${p.nick.toLowerCase()}`}>{p.points}</td>
              <td>{p.visits}</td>
              {QUESTS.map((q) => <td key={q} className={p.progress?.[q] ? "done" : "todo"}>{p.progress?.[q] ? "✓" : "·"}</td>)}
              <td className="muted">{new Date(p.last_seen).toLocaleString()}</td>
            </tr>
          ))}
          {players.length === 0 && <tr><td colSpan={11} className="muted">No players yet</td></tr>}
        </tbody>
      </table>
    </div>
  </section>
);
