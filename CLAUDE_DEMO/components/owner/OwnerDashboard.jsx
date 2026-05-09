import { getWaitTime } from "../../utils/queueHelpers";
import { COLORS, createStyles, RADIUS, TYPOGRAPHY, TRANSITIONS, SHADOWS } from "../../styles/theme";

const s = createStyles();

export default function OwnerDashboard({ shop, onAdvance, onRemove, onToggleOpen }) {
  const qLen = shop.queue.length;

  return (
    <div style={{ padding: 20 }}>
      <div style={{
        ...s.card,
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
        color: COLORS.white,
        marginBottom: 16,
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{
              fontSize: 20,
              fontWeight: TYPOGRAPHY.weights.extrabold,
              margin: 0,
            }}>
              {shop.name}
            </h2>
            <p style={{
              fontSize: 14,
              opacity: 0.8,
              marginTop: 4,
            }}>
              {shop.category}
            </p>
          </div>
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
        </div>
      </div>

      <button
        type="button"
        style={{
          ...(shop.isOpen ? s.btnDanger : s.btnAccent()),
          width: "100%",
          marginBottom: 20,
          fontSize: TYPOGRAPHY.sizes.base,
          padding: "13px 20px",
        }}
        onClick={onToggleOpen}
        aria-pressed={shop.isOpen}
      >
        {shop.isOpen ? "🔒 Cerrar Cola" : "🟢 Abrir Cola"}
      </button>

      <h2 style={s.sectionTitle}>
        Gestionar Cola
      </h2>

      {qLen === 0 ? (
        <div style={{
          ...s.card,
          textAlign: "center",
          padding: "32px 16px",
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden="true">✅</div>
          <div style={{
            fontWeight: TYPOGRAPHY.weights.bold,
            color: COLORS.text
          }}>
            La cola está vacía
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            marginTop: 4,
            color: COLORS.textMuted
          }}>
            No hay clientes esperando ahora.
          </div>
        </div>
      ) : (
        <>
          <div style={{
            ...s.card,
            background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.warning} 100%)`,
            border: `2px solid ${COLORS.accent}`,
            marginBottom: 12,
          }}>
            <p style={{
              fontSize: TYPOGRAPHY.sizes.xs,
              fontWeight: TYPOGRAPHY.weights.bold,
              color: COLORS.white,
              marginBottom: 4,
            }}>
              SIRVIENDO AHORA
            </p>
            <p style={{
              fontSize: 20,
              fontWeight: TYPOGRAPHY.weights.extrabold,
              color: COLORS.white,
              margin: 0,
            }}>
              {shop.queue[0].name}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="button"
                style={{
                  ...s.btnAccent(true),
                  flex: 1,
                  fontSize: 14,
                  padding: "10px",
                }}
                onClick={onAdvance}
              >
                ✓ Hecho — Siguiente
              </button>
              <button
                type="button"
                style={s.btnDanger}
                onClick={() => onRemove(shop.queue[0].id)}
                aria-label={`Eliminar a ${shop.queue[0].name} de la cola`}
              >
                ✕
              </button>
            </div>
          </div>

          {shop.queue.slice(1).map((customer, i) => (
            <div key={customer.id} style={{
              ...s.card,
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: RADIUS.full,
                background: COLORS.border,
                color: COLORS.textSecondary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: TYPOGRAPHY.weights.bold,
                fontSize: 14,
                marginRight: 12,
                flexShrink: 0,
              }}>
                {customer.position}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontWeight: TYPOGRAPHY.weights.bold,
                  margin: 0,
                }}>
                  {customer.name}
                </p>
                <p style={{
                  fontSize: TYPOGRAPHY.sizes.sm,
                  color: COLORS.textMuted,
                  margin: 0,
                }}>
                  ~{getWaitTime(shop, customer.position)} min espera
                </p>
              </div>
              <button
                type="button"
                style={s.btnDanger}
                onClick={() => onRemove(customer.id)}
                aria-label={`Eliminar a ${customer.name} de la cola`}
              >
                ✕
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
