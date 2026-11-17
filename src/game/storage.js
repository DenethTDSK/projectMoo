
import {
  INITIAL_STATS,
  applyTimeDecay,
  clamp,
} from "./petLogic";

const STORAGE_KEY = "moo_virtual_pet_save_v1";

function validStats(value) {
  return {
    fullness: Number.isFinite(value?.fullness)
      ? clamp(value.fullness)
      : INITIAL_STATS.fullness,

    happiness: Number.isFinite(value?.happiness)
      ? clamp(value.happiness)
      : INITIAL_STATS.happiness,

    energy: Number.isFinite(value?.energy)
      ? clamp(value.energy)
      : INITIAL_STATS.energy,
  };
}

export function loadGame() {
  const now = Date.now();

  const fresh = {
    stats: { ...INITIAL_STATS },
    theme: "light",
    lastSaved: now,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return fresh;

    const saved = JSON.parse(raw);

    if (!saved || typeof saved !== "object") {
      return fresh;
    }

    const timestamp = Number.isFinite(saved.lastSaved)
      ? Math.min(now, Math.max(0, saved.lastSaved))
      : now;

    return {
      stats: applyTimeDecay(
        validStats(saved.stats),
        (now - timestamp) / 60000
      ),
      theme: saved.theme === "dark" ? "dark" : "light",
      lastSaved: now,
    };
  } catch (error) {
    console.warn(
      "Moo could not load saved progress:",
      error
    );

    return fresh;
  }
}

export function saveGame(game) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stats: validStats(game.stats),
        theme: game.theme === "dark" ? "dark" : "light",
        lastSaved: game.lastSaved,
      })
    );

    return true;
  } catch (error) {
    console.warn(
      "Moo could not save progress:",
      error
    );

    return false;
  }
}

// Apply elapsed time to the current game state.
export function advanceGame(game, now = Date.now()) {
  const elapsedMinutes = Math.max(
    0,
    (now - game.lastSaved) / 60000
  );

  if (elapsedMinutes === 0) {
    return game;
  }

  return {
    ...game,
    stats: applyTimeDecay(game.stats, elapsedMinutes),
    lastSaved: now,
  };
}
