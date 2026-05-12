import { getCategoryEmoji } from "../../utils/queueHelpers";
import { COLORS, createStyles } from "../../styles/theme";

const s = createStyles();

export default function ShopCard({ shop, userId, onClick }) {
  const userInQueue = shop.queue.some((c) => c.id === userId);

  return (
    <div
      style={{
        ...s.card,
        cursor: "pointer",
        border: userInQueue ? `2px solid ${COLORS.accent}` : `2px solid transparent`,
        transition: "transform 0.15s",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: COLORS.primaryLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0,
        }}>
          {getCategoryEmoji(shop.category)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.text }}>
            {shop.name}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{shop.category}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={s.badge(
            shop.isOpen ? COLORS.success : COLORS.error,
            shop.isOpen ? COLORS.successLight : COLORS.errorLight,
          )}>
            {shop.isOpen ? "Open" : "Closed"}
          </span>
          {shop.queue.length > 0 && (
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
              {shop.queue.length} waiting
            </div>
          )}
          {userInQueue && (
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, marginTop: 2 }}>
              You're here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}