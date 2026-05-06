import { getWaitTime } from "../../utils/queueHelpers";
import { COLORS, createStyles } from "../../styles/theme";

const s = createStyles();

/**
 * Owner Dashboard
 * Allows shop owners to manage their queue, call next customers, and control open/close status
 * Real-time view of who's being served and who's waiting
 */
export default function OwnerDashboard({ shop, onAdvance, onRemove, onToggleOpen }) {
  const qLen = shop.queue.length;

  return (
    <div style={{ padding: 20 }}>
      {/* Shop Header */}
      <div style={{ ...s.card, background: COLORS.blue, color: COLORS.white, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{shop.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{shop.category}</div>
          </div>
          <div>
            <span style={s.pill(
              shop.isOpen ? COLORS.green : COLORS.red,
              shop.isOpen ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
            )}>
              {shop.isOpen ? "● Open" : "● Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Queue Status */}
      <button
        style={{
          ...(shop.isOpen ? s.btnDanger : s.btnOrange()),
          width: "100%",
          marginBottom: 20,
          fontSize: 15,
          padding: "13px 20px",
        }}
        onClick={onToggleOpen}
      >
        {shop.isOpen ? "🔒 Close Queue" : "🟢 Open Queue"}
      </button>

      {/* Queue management */}
      <div style={s.sectionTitle}>
        Manage Queue
      </div>

      {qLen === 0 ? (
        <div style={{ ...s.card, textAlign: "center", color: COLORS.gray400, padding: "32px 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 700, color: COLORS.gray600 }}>Queue is empty</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>No customers waiting right now.</div>
        </div>
      ) : (
        <>
          {/* Current customer highlight */}
          <div style={{
            ...s.card,
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeLight})`,
            border: `2px solid ${COLORS.orange}`,
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.orange, marginBottom: 4 }}>
              NOW SERVING
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.gray900 }}>
              {shop.queue[0].name}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{ ...s.btnOrange(true), flex: 1, fontSize: 14, padding: "10px" }} onClick={onAdvance}>
                ✓ Done — Next
              </button>
              <button style={s.btnDanger} onClick={() => onRemove(shop.queue[0].id)}>
                Remove
              </button>
            </div>
          </div>

          {/* Rest of queue */}
          {shop.queue.slice(1).map((customer, i) => (
            <div key={customer.id} style={{
              ...s.card,
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: COLORS.gray100, color: COLORS.gray600,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 14, marginRight: 12, flexShrink: 0,
              }}>
                {customer.position}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{customer.name}</div>
                <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                  ~{getWaitTime(shop, customer.position)} min wait
                </div>
              </div>
              <button style={s.btnDanger} onClick={() => onRemove(customer.id)}>
                ✕
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
