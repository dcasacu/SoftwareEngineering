// ═════════════════════════════════════════════════════════════════════════════════
// LINEUP - MEDITERRANEAN MARKET THEME
// Design tokens inspired by Mediterranean markets: warm terracotta, olive, sun
// ═════════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  primary: "#C2410C",      // Terracotta / Burnt Orange
  primaryDark: "#9A3412",  // Deep terracotta
  primaryLight: "#FEF3C7", // Warm cream
  secondary: "#15803D",   // Olive green
  secondaryLight: "#DCFCE7",
  
  accent: "#D97706",        // Amber / Sun
  accentLight: "#FEF3C7",
  
  background: "#FEF7ED",   // Warm sand
  surface: "#FFFFFF",
  surfaceWarm: "#FDF8F3",
  
  text: "#292524",         // Warm black
  textSecondary: "#78716C",
  textMuted: "#A8A29E",
  
  border: "#E7E0D8",
  borderStrong: "#D6CCC0",
  
  white: "#FFFFFF",
  success: "#16A34A",
  successLight: "#DCFCE7",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  warning: "#D97706",
  warningLight: "#FEF3C7",

  skeleton: "#E7E0D8",
  skeletonHighlight: "#F5F0E8",
};

export const TYPOGRAPHY = {
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', -apple-system, sans-serif",
  
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 28,
    "3xl": 36,
    "4xl": 48,
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
};

export const SHADOWS = {
  sm: "0 1px 3px rgba(41, 37, 36, 0.08)",
  md: "0 4px 12px rgba(41, 37, 36, 0.1)",
  lg: "0 8px 24px rgba(41, 37, 36, 0.12)",
  xl: "0 16px 48px rgba(41, 37, 36, 0.16)",
  inner: "inset 0 2px 4px rgba(41, 37, 36, 0.06)",
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: 9999,
};

export const TRANSITIONS = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "400ms cubic-bezier(0.16, 1, 0.3, 1)",
};

// ─── Style Factory ─────────────────────────────────────────────────────────────
export const createStyles = () => ({
  app: {
    fontFamily: TYPOGRAPHY.fontBody,
    background: COLORS.background,
    minHeight: "100vh",
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    boxShadow: `0 0 60px ${COLORS.borderStrong}40`,
    display: "flex",
    flexDirection: "column",
  },
  
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  
  logoText: {
    fontFamily: TYPOGRAPHY.fontDisplay,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
    letterSpacing: "-0.5px",
  },
  
  logoAccent: { 
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weights.extrabold,
  },
  
  badge: (color, bg) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: bg,
    color: color,
    borderRadius: RADIUS.full,
    padding: "5px 12px",
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  }),
  
  card: {
    background: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 14,
    boxShadow: SHADOWS.md,
    border: `1px solid ${COLORS.border}`,
    transition: `all ${TRANSITIONS.normal}`,
  },
  
  cardElevated: {
    background: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: 24,
    boxShadow: SHADOWS.lg,
    border: `1px solid ${COLORS.border}`,
  },
  
  btnPrimary: (small = false) => ({
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    color: COLORS.white,
    border: "none",
    borderRadius: RADIUS.lg,
    padding: small ? "12px 20px" : "16px 28px",
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontBody,
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: `all ${TRANSITIONS.fast}`,
    boxShadow: `0 4px 12px ${COLORS.primary}40`,
  }),
  
  btnSecondary: (small = false) => ({
    background: COLORS.surface,
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: RADIUS.lg,
    padding: small ? "10px 18px" : "14px 24px",
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontBody,
    cursor: "pointer",
    transition: `all ${TRANSITIONS.fast}`,
  }),
  
  btnAccent: (small = false) => ({
    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #B45309 100%)`,
    color: COLORS.white,
    border: "none",
    borderRadius: RADIUS.lg,
    padding: small ? "12px 20px" : "16px 28px",
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontBody,
    cursor: "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: `all ${TRANSITIONS.fast}`,
    boxShadow: `0 4px 12px ${COLORS.accent}40`,
  }),
  
  btnDanger: {
    background: COLORS.errorLight,
    color: COLORS.error,
    border: "none",
    borderRadius: RADIUS.md,
    padding: "12px 18px",
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontBody,
    cursor: "pointer",
  },
  
  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: RADIUS.lg,
    border: `2px solid ${COLORS.border}`,
    fontSize: TYPOGRAPHY.sizes.base,
    fontFamily: TYPOGRAPHY.fontBody,
    outline: "none",
    boxSizing: "border-box",
    color: COLORS.text,
    background: COLORS.surface,
    transition: `all ${TRANSITIONS.fast}`,
  },
  
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontDisplay,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  
  content: { 
    flex: 1, 
    overflowY: "auto", 
    paddingBottom: 90,
    paddingTop: 4,
  },
  
  skeleton: {
    background: `linear-gradient(90deg, ${COLORS.skeleton} 25%, ${COLORS.skeletonHighlight} 50%, ${COLORS.skeleton} 75%)`,
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: RADIUS.md,
  },
  
  skeletonCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
  },
  
  skeletonText: {
    height: 16,
    width: "100%",
  },
  
  skeletonTextShort: {
    height: 16,
    width: "60%",
  },
  
  skeletonTextTiny: {
    height: 12,
    width: "40%",
  },
  
  toast: (show, type = "default") => {
    const typeStyles = {
      success: { background: COLORS.success, border: `3px solid ${COLORS.white}` },
      error: { background: COLORS.error, border: `3px solid ${COLORS.white}` },
      warning: { background: COLORS.warning, border: `3px solid ${COLORS.white}` },
      default: { background: COLORS.text, border: "none" },
    };
    return {
      position: "fixed",
      bottom: 110,
      left: "50%",
      transform: `translateX(-50%) translateY(${show ? 0 : 60}px)`,
      opacity: show ? 1 : 0,
      color: COLORS.white,
      padding: "16px 24px",
      borderRadius: RADIUS.xl,
      fontWeight: TYPOGRAPHY.weights.semibold,
      fontSize: TYPOGRAPHY.sizes.base,
      zIndex: 999,
      transition: `all ${TRANSITIONS.slow}`,
      pointerEvents: "none",
      boxShadow: SHADOWS.xl,
      display: "flex",
      alignItems: "center",
      gap: 12,
      maxWidth: "90%",
      ...typeStyles[type],
    };
  },
  
  navBar: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: 430,
    background: `${COLORS.surface}EE`,
    backdropFilter: "blur(20px)",
    borderTop: `1px solid ${COLORS.border}`,
    display: "flex",
    zIndex: 100,
    paddingBottom: "env(safe-area-inset-bottom, 0)",
  },
  
  navItem: (active) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 4px 12px",
    cursor: "pointer",
    color: active ? COLORS.primary : COLORS.textMuted,
    fontWeight: active ? TYPOGRAPHY.weights.bold : TYPOGRAPHY.weights.medium,
    fontSize: TYPOGRAPHY.sizes.xs,
    gap: 4,
    transition: `all ${TRANSITIONS.fast}`,
    background: "none",
    border: "none",
    fontFamily: TYPOGRAPHY.fontBody,
  }),
});