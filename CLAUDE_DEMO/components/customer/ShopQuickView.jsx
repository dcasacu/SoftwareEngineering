import { getCategoryEmoji } from "../../utils/queueHelpers";
import { createStyles, COLORS } from "../../styles/theme";

const s = createStyles();

export default function ShopQuickView({ shop, onSelect, onClose, userId }) {
  const qLen = shop.queue.length;
  const userInQueue = shop.queue.some((c) => c.id === userId);

  return (
    <div style={{
      position: "absolute", bottom: "100%", left: "50%",
      transform: "translateX(-50%)", marginBottom: 12,
      background: COLORS.white, borderRadius: 20, padding: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)", width: 220, zIndex: 100,
      border: userInQueue ? `2px solid ${COLORS.accent}` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 24 }}>{getCategoryEmoji(shop.category)}</div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 18 }}>✕</button>
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.text }}>{shop.name}</div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{shop.category}</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
        <span style={s.badge(
          shop.isOpen ? COLORS.success : COLORS.error,
          shop.isOpen ? COLORS.successLight : COLORS.errorLight,
        )}>{shop.isOpen ? "Open" : "Closed"}</span>
        <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 700 }}>
          {qLen} waiting
        </span>
      </div>

      <button
        style={{ ...s.btnPrimary(true), marginTop: 14, width: "100%", borderRadius: 10 }}
        onClick={(e) => { e.stopPropagation(); onSelect(shop.id); }}
      >
        View Shop →
      </button>

      <div style={{
        position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
        width: 0, height: 0, borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent", borderTop: `8px solid ${COLORS.white}`,
      }} />
    </div>
  );
}
