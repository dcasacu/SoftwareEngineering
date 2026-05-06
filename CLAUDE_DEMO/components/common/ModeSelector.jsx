import { COLORS } from "../styles/theme";

/**
 * Mode Selector Screen
 * Initial screen where users choose between Customer or Shop Owner mode
 */
export default function ModeSelector({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh", background: COLORS.blue, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32, maxWidth: 430, margin: "0 auto",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🛒</div>
        <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.white, letterSpacing: "-1px" }}>
          Line <span style={{ color: COLORS.orange }}>Up</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 16 }}>
          Smart market queues
        </div>
      </div>

      <div style={{ width: "100%", marginBottom: 16 }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textAlign: "center", marginBottom: 16, textTransform: "uppercase" }}>
          Choose your mode
        </div>
        <button
          style={{
            width: "100%", background: COLORS.white, border: "none",
            borderRadius: 20, padding: "22px 24px", cursor: "pointer",
            marginBottom: 12, display: "flex", alignItems: "center", gap: 16,
            textAlign: "left", fontFamily: "inherit",
          }}
          onClick={() => onSelect("customer")}
        >
          <div style={{ fontSize: 36 }}>🧺</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.gray900 }}>Customer</div>
            <div style={{ fontSize: 13, color: COLORS.gray600, marginTop: 2 }}>Browse shops, join queues, track your turn</div>
          </div>
        </button>
        <button
          style={{
            width: "100%", background: COLORS.orange, border: "none",
            borderRadius: 20, padding: "22px 24px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16,
            textAlign: "left", fontFamily: "inherit",
          }}
          onClick={() => onSelect("owner")}
        >
          <div style={{ fontSize: 36 }}>🏪</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.white }}>Shop Owner</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Manage your queue & serving turns</div>
          </div>
        </button>
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 16 }}>
        Demo mode · No login required
      </div>
    </div>
  );
}
