import { COLORS, createStyles, RADIUS, TYPOGRAPHY, TRANSITIONS } from "../../styles/theme";
import PositionBadge from "../common/PositionBadge";

const s = createStyles();

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
        <h2 style={s.sectionTitle}>Mis Colas</h2>
        <div style={{
          ...s.card,
          textAlign: "center",
          padding: "48px 24px",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">🛒</div>
          <div style={{
            fontWeight: TYPOGRAPHY.weights.bold,
            fontSize: TYPOGRAPHY.sizes.base,
            color: COLORS.text
          }}>
            No hay colas activas
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            color: COLORS.textMuted,
            marginTop: 8
          }}>
            Ve a la pestaña Mapa para explorar tiendas y unirte a una cola.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={s.sectionTitle}>Mis Colas</h2>
      {myQueues.map(({ shop, entry }) => (
        <div key={shop.id} style={{ ...s.card, border: `2px solid ${COLORS.accent}33` }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14
          }}>
            <div>
              <h3 style={{
                fontWeight: TYPOGRAPHY.weights.extrabold,
                fontSize: TYPOGRAPHY.sizes.base,
                color: COLORS.text,
                margin: 0,
              }}>
                🥕 {shop.name}
              </h3>
              <p style={{
                fontSize: TYPOGRAPHY.sizes.sm,
                color: COLORS.textMuted,
                margin: "2px 0 0 0"
              }}>
                {shop.category}
              </p>
            </div>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: COLORS.successLight,
              color: COLORS.success,
              borderRadius: RADIUS.full,
              padding: "4px 10px",
              fontSize: TYPOGRAPHY.sizes.xs,
              fontWeight: TYPOGRAPHY.weights.bold,
            }}>
              Activa
            </span>
          </div>

          <PositionBadge
            position={entry.position}
            total={shop.queue.length}
            avgServiceTime={shop.avgServiceTime}
          />

          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 6,
              background: COLORS.border,
              borderRadius: 3,
              overflow: "hidden",
            }}>
              <div
                role="progressbar"
                aria-valuenow={Math.max(10, ((shop.queue.length - entry.position + 1) / shop.queue.length) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progreso en la cola"
                style={{
                  height: "100%",
                  width: `${Math.max(10, ((shop.queue.length - entry.position + 1) / shop.queue.length) * 100)}%`,
                  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
                  borderRadius: 3,
                  transition: `width ${TRANSITIONS.normal}`,
                }}
              />
            </div>
            <p style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              color: COLORS.textMuted,
              marginTop: 4,
            }}>
              {shop.queue.length - entry.position} personas delante de ti
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              type="button"
              style={{ ...s.btnSecondary(true), flex: 1 }}
              onClick={() => onGoToShop(shop.id)}
            >
              Ver Tienda
            </button>
            <button
              type="button"
              style={s.btnDanger}
              onClick={() => onLeaveQueue(shop.id)}
            >
              Salir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
