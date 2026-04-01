import React, { useState } from "react";

/* ─── Inline styles (no extra CSS file needed) ─────────────────────────── */
const S = {
  root: {
    minHeight: "100vh",
    background: "#0d0f14",
    color: "#e8eaf0",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px 80px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    fontWeight: 700,
    color: "#7ee8a2",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    fontSize: "0.95rem",
  },
  card: {
    background: "#161920",
    border: "1px solid #252830",
    borderRadius: "16px",
    padding: "28px",
    width: "100%",
    maxWidth: "760px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontFamily: "'Space Mono', monospace",
    color: "#7ee8a2",
    marginBottom: "8px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    background: "#0d0f14",
    border: "1px solid #2e3340",
    borderRadius: "10px",
    color: "#e8eaf0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    padding: "14px 18px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    background: "#7ee8a2",
    border: "none",
    borderRadius: "10px",
    color: "#0d0f14",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.85rem",
    fontWeight: 700,
    padding: "14px 22px",
    transition: "opacity 0.2s, transform 0.1s",
    whiteSpace: "nowrap",
  },
  hints: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "14px",
  },
  hintChip: {
    background: "#1e2230",
    border: "1px solid #2e3340",
    borderRadius: "20px",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "0.78rem",
    padding: "5px 12px",
    transition: "border-color 0.2s, color 0.2s",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #252830",
    margin: "24px 0",
  },
  sqlBox: {
    background: "#0d0f14",
    border: "1px solid #2e3340",
    borderRadius: "10px",
    padding: "14px 18px",
    marginBottom: "20px",
  },
  sqlLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.7rem",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "6px",
  },
  sqlText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.85rem",
    color: "#f59e0b",
    margin: 0,
    wordBreak: "break-all",
  },
  resultMeta: {
    fontSize: "0.82rem",
    color: "#6b7280",
    marginBottom: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.72rem",
    color: "#7ee8a2",
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "10px 14px",
    borderBottom: "1px solid #252830",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #1a1d24",
    color: "#c9cdd8",
  },
  tdAlt: {
    padding: "12px 14px",
    borderBottom: "1px solid #1a1d24",
    color: "#c9cdd8",
    background: "#13161c",
  },
  genderBadge: (gender) => ({
    background: gender === "Female" ? "#3d2a5e" : "#1a3a5e",
    color: gender === "Female" ? "#c084fc" : "#60a5fa",
    borderRadius: "12px",
    padding: "2px 10px",
    fontSize: "0.78rem",
    fontWeight: 500,
  }),
  emptyMsg: {
    color: "#6b7280",
    textAlign: "center",
    padding: "24px 0",
    fontSize: "0.9rem",
  },
  errorBox: {
    background: "#2a1414",
    border: "1px solid #7f1d1d",
    borderRadius: "10px",
    color: "#f87171",
    padding: "14px 18px",
    fontSize: "0.88rem",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid #0d0f14",
    borderTop: "2px solid #0d0f14aa",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    verticalAlign: "middle",
    marginRight: "8px",
  },
};

const HINTS = [
  "Show me all female customers from Mumbai",
  "List all customers from Delhi",
  "How many male customers are there?",
  "Show customers from Bangalore",
  "List all customers",
];

export default function App() {
  const [query, setQuery]     = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);   // { sql_query, results, message }
  const [error, setError]     = useState(null);

  const handleSubmit = async (q) => {
    const text = (q || query).trim();
    if (!text) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHint = (hint) => {
    setQuery(hint);
    handleSubmit(hint);
  };

  // Derive table columns from first result row
  const columns = result?.results?.length > 0 ? Object.keys(result.results[0]) : [];

  return (
    <div style={S.root}>
      {/* Spinner keyframe hack */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <header style={S.header}>
        <h1 style={S.title}>⚡ Customer Chatbot</h1>
        <p style={S.subtitle}>Ask anything about the customer database in plain English.</p>
      </header>

      {/* ── Query card ── */}
      <div style={S.card}>
        <label style={S.label}>Your Question</label>
        <div style={S.inputRow}>
          <input
            style={S.input}
            placeholder='e.g. "Show all female customers from Mumbai"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={(e) => (e.target.style.borderColor = "#7ee8a2")}
            onBlur={(e)  => (e.target.style.borderColor = "#2e3340")}
          />
          <button
            style={{ ...S.button, opacity: loading ? 0.6 : 1 }}
            onClick={() => handleSubmit()}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.target.style.opacity = "0.85")}
            onMouseOut={(e)  => (e.target.style.opacity = loading ? "0.6" : "1")}
          >
            {loading ? (
              <>
                <span style={S.spinner} />
                Asking…
              </>
            ) : (
              "Ask →"
            )}
          </button>
        </div>

        {/* Example hint chips */}
        <div style={S.hints}>
          {HINTS.map((h) => (
            <span
              key={h}
              style={S.hintChip}
              onClick={() => handleHint(h)}
              onMouseOver={(e) => {
                e.target.style.borderColor = "#7ee8a2";
                e.target.style.color = "#e8eaf0";
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = "#2e3340";
                e.target.style.color = "#9ca3af";
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* ── Results section ── */}
        {(result || error) && <hr style={S.divider} />}

        {error && <div style={S.errorBox}>❌ {error}</div>}

        {result && !error && (
          <>
            {/* Generated SQL */}
            {result.sql_query && (
              <div style={S.sqlBox}>
                <div style={S.sqlLabel}>Generated SQL</div>
                <pre style={S.sqlText}>{result.sql_query}</pre>
              </div>
            )}

            {/* Row count */}
            <div style={S.resultMeta}>{result.message}</div>

            {/* Results table */}
            {result.results.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th key={col} style={S.th}>
                          {col.replace("_", " ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((row, i) => (
                      <tr key={i}>
                        {columns.map((col) => (
                          <td key={col} style={i % 2 === 0 ? S.td : S.tdAlt}>
                            {col === "gender" ? (
                              <span style={S.genderBadge(row[col])}>{row[col]}</span>
                            ) : (
                              String(row[col])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={S.emptyMsg}>No results found for your query.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
