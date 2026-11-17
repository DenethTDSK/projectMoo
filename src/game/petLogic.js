
export const INITIAL_STATS = {
  fullness: 80,
  happiness: 80,
  energy: 80,
};

// Faster response between interactions.
export const ACTION_COOLDOWN_MS = 300;

export const ACTIONS = {
  feed: { label: "Feed" },
  pet: { label: "Pet" },
  play: { label: "Play" },
  sleep: { label: "Sleep" },
};

export function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

export function performAction(stats, action) {
  const next = { ...stats };

  switch (action) {
    case "feed":
      next.fullness += 20;
      next.happiness += 3;
      break;

    case "pet":
      next.happiness += 15;
      break;

    case "play":
      if (next.energy < 15) return stats;

      next.happiness += 20;
      next.energy -= 15;
      next.fullness -= 8;
      break;

    case "sleep":
      next.energy += 30;
      next.fullness -= 5;
      break;

    default:
      return stats;
  }

  return {
    fullness: clamp(next.fullness),
    happiness: clamp(next.happiness),
    energy: clamp(next.energy),
  };
}

// All three needs decrease over time.
export function applyTimeDecay(stats, elapsedMinutes) {
  const minutes = Number.isFinite(elapsedMinutes)
    ? Math.max(0, elapsedMinutes)
    : 0;

  return {
    // Fullness decreases by 1 point per minute.
    fullness: clamp(stats.fullness - minutes * 5),

    // Happiness decreases by 0.75 points per minute.
    happiness: clamp(stats.happiness - minutes * 8),

    // Energy decreases by 0.5 points per minute.
    energy: clamp(stats.energy - minutes * 10),
  };
}


// Select your hand-drawn cow expression.
export function getCowMood(stats) {
  if (stats.fullness <= 25) return "Hungry";
  if (stats.energy <= 25) return "Sleepy";
  if (stats.happiness <= 25) return "Sad";

  if (
    stats.fullness >= 70 &&
    stats.happiness >= 70 &&
    stats.energy >= 50
  ) {
    return "Happy";
  }

  return "Normal";
}
