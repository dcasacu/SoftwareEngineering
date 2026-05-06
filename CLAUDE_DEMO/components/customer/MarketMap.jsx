import { useState } from "react";
import { getCategoryEmoji } from "../../utils/queueHelpers";
import { COLORS } from "../../styles/theme";
import ShopQuickView from "./ShopQuickView";

/**
 * Market Map Visualization
 * Interactive map showing shop pins with queue counts
 * Tap pins to see quick view popup
 */
export default function MarketMap({ shops, onSelectShop, userId }) {
  const [selectedPin, setSelectedPin] = useState(null);

  return (
    <div style={{
      margin: "0 20px 16px",
      background: `linear-gradient(135deg, #e8f0fe 0%, #dbeafe 50%, #eff6ff 100%)`,
      borderRadius: 24, position: "relative", height: 300, overflow: "hidden",
      border: `2px solid ${COLORS.gray200}`, flexShrink: 0,
      boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)",
    }}>
      {/* Grid lines */}
      {[...Array(5)].map((_, i) => (
        <div key={`h${i}`} style={{
          position: "absolute", left: 0, right: 0,
          top: `${(i + 1) * 20}%`, height: 1,
          background: "rgba(46,91,186,0.08)",
        }} />
      ))}
      {[...Array(5)].map((_, i) => (
        <div key={`v${i}`} style={{
          position: "absolute", top: 0, bottom: 0,
          left: `${(i + 1) * 20}%`, width: 1,
          background: "rgba(46,91,186,0.08)",
        }} />
      ))}

      {/* Pins */}
      {shops.map((shop) => {
        const isSelected = selectedPin === shop.id;
        const userInQueue = shop.queue.some((c) => c.id === userId);
        const qLen = shop.queue.length;

        return (
          <div
            key={shop.id}
            onClick={() => setSelectedPin(isSelected ? null : shop.id)}
            style={{
              position: "absolute", left: `${shop.position.x}%`, top: `${shop.position.y}%`,
              transform: "translate(-50%, -100%)", cursor: "pointer",
              zIndex: isSelected ? 10 : 2, transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {isSelected && (
              <ShopQuickView
                shop={shop}
                onSelect={onSelectShop}
                onClose={() => setSelectedPin(null)}
                userId={userId}
              />
            )}

            {/* Pin Visual */}
            <div style={{
              background: userInQueue ? COLORS.orange : (shop.isOpen ? COLORS.blue : COLORS.gray400),
              borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
              width: isSelected ? 44 : 36, height: isSelected ? 44 : 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isSelected ? "0 8px 20px rgba(0,0,0,0.25)" : "0 4px 10px rgba(0,0,0,0.15)",
              transition: "all 0.2s", border: `3px solid ${COLORS.white}`,
            }}>
              <span style={{ transform: "rotate(45deg)", fontSize: isSelected ? 20 : 16 }}>
                {getCategoryEmoji(shop.category)}
              </span>
            </div>

            {/* Queue count badge */}
            {qLen > 0 && !isSelected && (
              <div style={{
                position: "absolute", top: -5, right: -5,
                background: COLORS.orange, color: COLORS.white,
                borderRadius: "50%", width: 20, height: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, border: `2px solid ${COLORS.white}`,
                transform: "rotate(45deg)",
              }}>
                {qLen}
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 12, right: 12,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12, padding: "8px 12px",
        fontSize: 11, color: COLORS.gray600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.orange }} />
          <span style={{ fontWeight: 600 }}>Your active queues</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.blue }} />
          <span style={{ fontWeight: 600 }}>Open shops</span>
        </div>
      </div>
    </div>
  );
}
