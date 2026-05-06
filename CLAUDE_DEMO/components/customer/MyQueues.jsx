import { COLORS, createStyles } from "../../styles/theme";
import PositionBadge from "../common/PositionBadge";

const s = createStyles();

/**
 * My Queues Tab
 * Shows all queues the customer is currently in with real-time position tracking
 * Allows canceling queues and navigating to shop details
 */
export default function MyQueues({ shops, onLeaveQueue, onGoToShop, userId }) {
  const myQueues = shops
    .filter((shop) => shop.queue.some((c) => c.id === userId))
    .map((shop) => {
      const entry = shop.queue.find((c) => c.id === userId);
      return { shop, entry };
    });

  if (myQueues.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <div style={s.sectionTitle}>My Queues</div>
        <div style={{
          ...s.card, textAlign: "center", padding: "48px 24px",
          color: COLORS.gray400,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.gray600 }}>No active queues</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Go to the Map tab to browse shops and join a queue.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={s.sectionTitle}>My Queues</div>
      {myQueues.map(({ shop, entry }) => (
        <div key={shop.id} style={{ ...s.card, border: `2px solid ${COLORS.blueLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.gray900 }}>
                🥕 {shop.name}
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray400, marginTop: 2 }}>{shop.category}</div>
            </div>
            <span style={s.pill(COLORS.green, COLORS.greenLight)}>Active</span>
          </div>

          <PositionBadge
            position={entry.position}
            total={shop.queue.length}
            avgServiceTime={shop.avgServiceTime}
          />

          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 6, background: COLORS.gray100, borderRadius: 3, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.max(10, ((shop.queue.length - entry.position + 1) / shop.queue.length) * 100)}%`,
                background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.orange})`,
                borderRadius: 3,
                transition: "width 0.5s",
              }} />
            </div>
            <div style={{ fontSize: 11, color: COLORS.gray400, marginTop: 4 }}>
              {shop.queue.length - entry.position} people ahead of you
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={{ ...s.btn(true, true), flex: 1 }} onClick={() => onGoToShop(shop.id)}>
              View Shop
            </button>
            <button style={s.btnDanger} onClick={() => onLeaveQueue(shop.id)}>
              Leave
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
