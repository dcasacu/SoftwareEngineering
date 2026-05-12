import { getWaitTime } from "../../utils/queueHelpers";
import { createStyles, COLORS, RADIUS, TYPOGRAPHY } from "../../styles/theme";

const s = createStyles();

export default function PositionBadge({ position, total, avgServiceTime }) {
  return (
    <div style={{
      background: COLORS.primaryLight,
      borderRadius: RADIUS.lg,
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: `2px solid ${COLORS.primary}22`,
    }}>
      <div>
        <div style={{
          fontSize: TYPOGRAPHY.sizes.sm,
          color: COLORS.textSecondary,
          fontWeight: TYPOGRAPHY.weights.semibold
        }}>
          Tu posición
        </div>
        <div style={{
          fontSize: 38,
          fontWeight: TYPOGRAPHY.weights.extrabold,
          color: COLORS.primary,
          lineHeight: 1
        }}>
          #{position}
        </div>
        <div style={{
          fontSize: 12,
          color: COLORS.textMuted,
          marginTop: 2
        }}>
          de {total} en cola
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{
          fontSize: TYPOGRAPHY.sizes.sm,
          color: COLORS.textSecondary,
          fontWeight: TYPOGRAPHY.weights.semibold
        }}>
          Esp. espera
        </div>
        <div style={{
          fontSize: 28,
          fontWeight: TYPOGRAPHY.weights.extrabold,
          color: COLORS.accent,
          lineHeight: 1
        }}>
          {getWaitTime({ avgServiceTime }, position)}m
        </div>
        <div style={{
          fontSize: 12,
          color: COLORS.textMuted,
          marginTop: 2
        }}>
          minutos
        </div>
      </div>
    </div>
  );
}
