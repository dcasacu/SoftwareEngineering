import { getWaitTime } from "../../utils/queueHelpers";
import { createStyles, COLORS } from "../../styles/theme";

const s = createStyles();

/**
 * Position Badge Component
 * Displays current queue position and estimated waiting time
 * Real-time updates as queue progresses
 */
export default function PositionBadge({ position, total, avgServiceTime }) {
  return (
    <div style={{
      background: COLORS.blueLight, borderRadius: 16, padding: "16px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      border: `2px solid ${COLORS.blue}22`,
    }}>
      <div>
        <div style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Your position</div>
        <div style={{ fontSize: 38, fontWeight: 900, color: COLORS.blue, lineHeight: 1 }}>
          #{position}
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>of {total} in queue</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, color: COLORS.gray600, fontWeight: 600 }}>Est. wait</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.orange, lineHeight: 1 }}>
          {getWaitTime({ avgServiceTime }, position)}m
        </div>
        <div style={{ fontSize: 12, color: COLORS.gray400, marginTop: 2 }}>minutes</div>
      </div>
    </div>
  );
}
