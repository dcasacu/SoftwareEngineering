import { getUserQueueEntry, getWaitTime } from "../../utils/queueHelpers";
import { COLORS, createStyles } from "../../styles/theme";
import PositionBadge from "../common/PositionBadge";

const s = createStyles();

/**
 * Shop Detail View
 * Full page detail of a specific shop with queue information
 * Customers can join or leave queues from this view
 */
export default function ShopDetail({ shop, onBack, onJoin, onLeave, userId }) {
  const userEntry = getUserQueueEntry(shop, userId);
  const qLen = shop.queue.length;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
        padding: "24px 20px 32px",
      }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "6px 12px", color: COLORS.white, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, marginBottom: 16 }}
        >
          ← Back
        </button>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🥕</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.white }}>{shop.name}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
          {shop.category} · {shop.description}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span style={s.pill(
            shop.isOpen ? COLORS.green : COLORS.red,
            shop.isOpen ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"
          )}>
            {shop.isOpen ? "● Open" : "● Closed"}
          </span>
          <span style={s.pill(COLORS.white, "rgba(255,255,255,0.2)")}>
            ~{shop.avgServiceTime} min/customer
          </span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* User position */}
        {userEntry && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.gray600, marginBottom: 8 }}>
              Your Queue Status
            </div>
            <PositionBadge position={userEntry.position} total={qLen} avgServiceTime={shop.avgServiceTime} />
          </div>
        )}

        {/* Queue info */}
        <div style={s.card}>
          <div style={{ fontWeight: 800, color: COLORS.gray900, marginBottom: 12 }}>
            Current Queue
          </div>
          {qLen === 0 ? (
            <div style={{ color: COLORS.gray400, fontSize: 14, textAlign: "center", padding: "16px 0" }}>
              No one in queue — join now!
            </div>
          ) : (
            shop.queue.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < qLen - 1 ? `1px solid ${COLORS.gray100}` : "none",
                  background: c.id === userId ? COLORS.orangeLight : "transparent",
                  borderRadius: c.id === userId ? 8 : 0,
                  paddingLeft: c.id === userId ? 8 : 0,
                  paddingRight: c.id === userId ? 8 : 0,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i === 0 ? COLORS.blue : COLORS.gray100,
                  color: i === 0 ? COLORS.white : COLORS.gray600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 13, marginRight: 12, flexShrink: 0,
                }}>
                  {c.position}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {c.id === userId ? "You 👋" : c.name}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray400 }}>
                    ~{getWaitTime(shop, c.position)} min wait
                  </div>
                </div>
                {i === 0 && <span style={s.pill(COLORS.orange, COLORS.orangeLight)}>Next up</span>}
              </div>
            ))
          )}
        </div>

        {/* Action */}
        {shop.isOpen ? (
          userEntry ? (
            <button style={s.btnDanger} onClick={onLeave}>
              Leave Queue
            </button>
          ) : (
            <button style={s.btnOrange()} onClick={onJoin}>
              Join Queue →
            </button>
          )
        ) : (
          <div style={{
            ...s.card, textAlign: "center", color: COLORS.gray400, padding: "16px",
          }}>
            This shop is currently closed
          </div>
        )}
      </div>
    </div>
  );
}
