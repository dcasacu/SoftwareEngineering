import { getUserQueueEntry, getWaitTime } from "../../utils/queueHelpers";
import { COLORS, createStyles, RADIUS, TYPOGRAPHY, SHADOWS, TRANSITIONS } from "../../styles/theme";
import PositionBadge from "../common/PositionBadge";

const s = createStyles();

export default function ShopDetail({ shop, onBack, onJoin, onLeave, userId }) {
  const userEntry = getUserQueueEntry(shop, userId);
  const qLen = shop.queue.length;

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
        padding: "24px 20px 32px",
      }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver atrás"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: RADIUS.md,
            padding: "6px 12px",
            color: COLORS.white,
            cursor: "pointer",
            fontFamily: TYPOGRAPHY.fontBody,
            fontWeight: TYPOGRAPHY.weights.bold,
            marginBottom: 16,
          }}
        >
          ← Volver
        </button>
        <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden="true">🥕</div>
        <h2 style={{
          fontSize: 24,
          fontWeight: TYPOGRAPHY.weights.extrabold,
          color: COLORS.white,
          margin: "0 0 4px 0",
          fontFamily: TYPOGRAPHY.fontDisplay,
        }}>
          {shop.name}
        </h2>
        <p style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
        }}>
          {shop.category} · {shop.description}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: shop.isOpen ? `${COLORS.success}33` : `${COLORS.error}33`,
            color: shop.isOpen ? COLORS.white : COLORS.white,
            borderRadius: RADIUS.full,
            padding: "4px 10px",
            fontSize: TYPOGRAPHY.sizes.xs,
            fontWeight: TYPOGRAPHY.weights.bold,
          }}>
            {shop.isOpen ? "● Abierto" : "● Cerrado"}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.2)",
            color: COLORS.white,
            borderRadius: RADIUS.full,
            padding: "4px 10px",
            fontSize: TYPOGRAPHY.sizes.xs,
            fontWeight: TYPOGRAPHY.weights.bold,
          }}>
            ~{shop.avgServiceTime} min/cliente
          </span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {userEntry && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{
              fontSize: TYPOGRAPHY.sizes.sm,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.textSecondary,
              marginBottom: 8,
            }}>
              Tu Estado en la Cola
            </h3>
            <PositionBadge position={userEntry.position} total={qLen} avgServiceTime={shop.avgServiceTime} />
          </div>
        )}

        <div style={s.card}>
          <h3 style={{
            fontWeight: TYPOGRAPHY.weights.extrabold,
            color: COLORS.text,
            marginBottom: 12,
          }}>
            Cola Actual
          </h3>
          {qLen === 0 ? (
            <div style={{
              color: COLORS.textMuted,
              fontSize: TYPOGRAPHY.sizes.sm,
              textAlign: "center",
              padding: "16px 0"
            }}>
              Nadie en cola — ¡únete ahora!
            </div>
          ) : (
            shop.queue.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < qLen - 1 ? `1px solid ${COLORS.border}` : "none",
                  background: c.id === userId ? COLORS.accentLight : "transparent",
                  borderRadius: c.id === userId ? RADIUS.md : 0,
                  paddingLeft: c.id === userId ? RADIUS.sm : 0,
                  paddingRight: c.id === userId ? RADIUS.sm : 0,
                  marginLeft: c.id === userId ? -8 : 0,
                  marginRight: c.id === userId ? -8 : 0,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: RADIUS.full,
                  background: i === 0 ? COLORS.primary : COLORS.border,
                  color: i === 0 ? COLORS.white : COLORS.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: TYPOGRAPHY.weights.bold,
                  fontSize: 13,
                  marginRight: 12,
                  flexShrink: 0,
                }}>
                  {c.position}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: TYPOGRAPHY.weights.bold,
                    fontSize: TYPOGRAPHY.sizes.sm,
                  }}>
                    {c.id === userId ? "Tú 👋" : c.name}
                  </div>
                  <div style={{
                    fontSize: TYPOGRAPHY.sizes.xs,
                    color: COLORS.textMuted
                  }}>
                    ~{getWaitTime(shop, c.position)} min espera
                  </div>
                </div>
                {i === 0 && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: COLORS.accentLight,
                    color: COLORS.accent,
                    borderRadius: RADIUS.full,
                    padding: "4px 10px",
                    fontSize: TYPOGRAPHY.sizes.xs,
                    fontWeight: TYPOGRAPHY.weights.bold,
                  }}>
                    Siguiente
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {shop.isOpen ? (
          userEntry ? (
            <button
              type="button"
              style={s.btnDanger}
              onClick={onLeave}
            >
              Salir de la Cola
            </button>
          ) : (
            <button
              type="button"
              style={s.btnAccent()}
              onClick={onJoin}
            >
              Unirse a la Cola →
            </button>
          )
        ) : (
          <div style={{
            ...s.card,
            textAlign: "center",
            color: COLORS.textMuted,
            padding: "16px",
          }}>
            Esta tienda está actualmente cerrada
          </div>
        )}
      </div>
    </div>
  );
}
