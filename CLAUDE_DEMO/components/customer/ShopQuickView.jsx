import { getCategoryEmoji } from "../../utils/queueHelpers";
import { createStyles, COLORS, RADIUS, TYPOGRAPHY, SHADOWS } from "../../styles/theme";

const s = createStyles();

export default function ShopQuickView({ shop, onSelect, onClose, userId }) {
  const qLen = shop.queue.length;
  const userInQueue = shop.queue.some((c) => c.id === userId);

  return (
    <div
      role="dialog"
      aria-label={`Vista rápida de ${shop.name}`}
      style={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 12,
        background: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: "16px",
        boxShadow: SHADOWS.xl,
        width: 220,
        zIndex: 100,
        border: userInQueue ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 24 }} aria-hidden="true">{getCategoryEmoji(shop.category)}</div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Cerrar"
          style={{
            background: "none",
            border: "none",
            color: COLORS.textMuted,
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
      <h3 style={{
        fontWeight: TYPOGRAPHY.weights.extrabold,
        fontSize: 16,
        color: COLORS.text,
        margin: "0 0 2px 0",
      }}>
        {shop.name}
      </h3>
      <p style={{
        fontSize: TYPOGRAPHY.sizes.sm,
        color: COLORS.textMuted,
        margin: 0,
      }}>
        {shop.category}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        <span style={s.badge(
          shop.isOpen ? COLORS.success : COLORS.error,
          shop.isOpen ? COLORS.successLight : COLORS.errorLight,
        )}>
          {shop.isOpen ? "Abierto" : "Cerrado"}
        </span>
        <span style={{
          fontSize: TYPOGRAPHY.sizes.sm,
          color: COLORS.textSecondary,
          fontWeight: TYPOGRAPHY.weights.bold
        }}>
          {qLen} esperando
        </span>
      </div>

      <button
        type="button"
        style={{
          ...s.btnPrimary(true),
          marginTop: 14,
          width: "100%",
          borderRadius: RADIUS.md,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(shop.id); }}
      >
        Ver Tienda →
      </button>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `8px solid ${COLORS.white}`,
        }}
      />
    </div>
  );
}
