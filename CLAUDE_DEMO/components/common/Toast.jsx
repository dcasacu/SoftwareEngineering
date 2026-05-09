import { createStyles, COLORS, RADIUS, SHADOWS, TRANSITIONS, TYPOGRAPHY } from "../../styles/theme";

const s = createStyles();

const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  yourTurn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  default: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const typeStyles = {
  success: { background: COLORS.success, border: `3px solid ${COLORS.white}` },
  error: { background: COLORS.error, border: `3px solid ${COLORS.white}` },
  warning: { background: COLORS.warning, border: `3px solid ${COLORS.white}` },
  info: { background: COLORS.blue || "#3B82F6", border: `3px solid ${COLORS.white}` },
  yourTurn: { background: "#000000", border: `3px solid ${COLORS.accent}`, boxShadow: `0 0 20px ${COLORS.accent}60, ${SHADOWS.xl}` },
  default: { background: COLORS.text, border: "none" },
};

export default function Toast({ message, show, type = "default" }) {
  if (!message) return null;

  const icon = icons[type] || icons.default;
  const style = typeStyles[type] || typeStyles.default;
  const isYourTurn = type === "yourTurn";

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: isYourTurn ? 200 : 110,
        left: "50%",
        transform: `translateX(-50%) translateY(${show ? 0 : 60}px)`,
        opacity: show ? 1 : 0,
        color: COLORS.white,
        padding: isYourTurn ? "20px 28px" : "14px 20px",
        borderRadius: RADIUS.xl,
        fontWeight: isYourTurn ? TYPOGRAPHY.weights.extrabold : TYPOGRAPHY.weights.bold,
        fontSize: isYourTurn ? TYPOGRAPHY.sizes.lg : TYPOGRAPHY.sizes.base,
        fontFamily: TYPOGRAPHY.fontBody,
        zIndex: 99999,
        transition: isYourTurn ? "transform 0.3s ease, opacity 0.3s ease" : `all ${TRANSITIONS.slow}`,
        pointerEvents: "none",
        boxShadow: isYourTurn ? `0 0 30px ${COLORS.accent}80, 0 0 60px ${COLORS.accent}40, ${SHADOWS.xl}` : SHADOWS.xl,
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: "90%",
        minWidth: 260,
        ...style,
        ...(isYourTurn ? { background: "#000000", border: `3px solid ${COLORS.accent}` } : {}),
      }}
    >
      <span style={{ flexShrink: 0, fontSize: isYourTurn ? 24 : 20 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
