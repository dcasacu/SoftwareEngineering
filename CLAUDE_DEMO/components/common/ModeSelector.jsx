import { COLORS, RADIUS, TYPOGRAPHY, TRANSITIONS, SHADOWS } from "../../styles/theme";

export default function ModeSelector({ onSelect }) {
  return (
    <main
      role="main"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }} aria-hidden="true">🛒</div>
        <h1 style={{
          fontSize: 42,
          fontWeight: TYPOGRAPHY.weights.extrabold,
          color: COLORS.white,
          letterSpacing: "-1px",
          margin: 0,
          fontFamily: TYPOGRAPHY.fontDisplay,
        }}>
          Line<span style={{ color: COLORS.accent }}>Up</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8, fontSize: 16 }}>
          Smart market queues
        </p>
      </div>

      <div style={{ width: "100%", marginBottom: 16 }}>
        <p style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: TYPOGRAPHY.sizes.xs,
          fontWeight: TYPOGRAPHY.weights.bold,
          letterSpacing: 1,
          textAlign: "center",
          marginBottom: 16,
          textTransform: "uppercase"
        }}>
          Elige tu modo
        </p>

        <button
          type="button"
          onClick={() => onSelect("customer")}
          style={{
            width: "100%",
            background: COLORS.white,
            border: "none",
            borderRadius: RADIUS.xl,
            padding: "22px 24px",
            cursor: "pointer",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
            textAlign: "left",
            fontFamily: "inherit",
            transition: `all ${TRANSITIONS.fast}`,
            boxShadow: SHADOWS.lg,
          }}
        >
          <div style={{ fontSize: 36 }} aria-hidden="true">🧺</div>
          <div>
            <div style={{
              fontSize: TYPOGRAPHY.sizes.md,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.text
            }}>
              Cliente
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: COLORS.textSecondary,
              marginTop: 2
            }}>
              Browse shops, join queues, track your turn
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect("owner")}
          style={{
            width: "100%",
            background: COLORS.accent,
            border: "none",
            borderRadius: RADIUS.xl,
            padding: "22px 24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 16,
            textAlign: "left",
            fontFamily: "inherit",
            transition: `all ${TRANSITIONS.fast}`,
            boxShadow: SHADOWS.lg,
          }}
        >
          <div style={{ fontSize: 36 }} aria-hidden="true">🏪</div>
          <div>
            <div style={{
              fontSize: TYPOGRAPHY.sizes.md,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.white
            }}>
             店主
            </div>
            <div style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              color: "rgba(255,255,255,0.8)",
              marginTop: 2
            }}>
              Gestiona tu cola y sirve a clientes
            </div>
          </div>
        </button>
      </div>

      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: TYPOGRAPHY.sizes.xs, marginTop: 16 }}>
        Modo demo · No requiere inicio de sesión
      </p>
    </main>
  );
}
