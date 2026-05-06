import { createStyles, COLORS } from "../styles/theme";

const s = createStyles();

/**
 * Toast Notification Component
 * Provides non-blocking feedback to users (success, error, info)
 */
export default function Toast({ message, show }) {
  return <div style={s.toast(show)}>{message}</div>;
}
