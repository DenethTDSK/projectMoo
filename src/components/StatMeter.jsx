
import "./StatMeter.css";

const CONFIG = {
  fullness: {
    label: "Fullness",
    color: "#79B87D",
  },
  happiness: {
    label: "Happiness",
    color: "#E9A5B0",
  },
  energy: {
    label: "Energy",
    color: "#E5BC65",
  },
};

export default function StatMeter({
  type,
  value = 0,
}) {
  const config = CONFIG[type];

  if (!config) return null;

  const amount = Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : 0;

  return (
    <div className="stat-meter">
      <div className="stat-meter__header">
        <span className="stat-meter__label">
          {config.label}
        </span>

        <span className="stat-meter__value">
          {Math.round(amount)}%
        </span>
      </div>

      <div
        className="stat-meter__track"
        role="progressbar"
        aria-label={config.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(amount)}
      >
        <div
          className="stat-meter__fill"
          style={{
            width: `${amount}%`,
            backgroundColor: config.color,
          }}
        />
      </div>
    </div>
  );
}
