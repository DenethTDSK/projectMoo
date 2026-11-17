
import { useEffect, useRef, useState } from "react";

import CowStage from "./components/CowStage";
import StatMeter from "./components/StatMeter";
import ActionButtons from "./components/ActionButtons";

import { performAction } from "./game/petLogic";

import {
  advanceGame,
  loadGame,
  saveGame,
} from "./game/storage";

import "./App.css";

const ACTION_MESSAGES = {
  feed: "Yummy! Thank you for feeding me!",
  pet: "Moo loves your cuddles!",
  play: "That was so much fun!",
  sleep: "Sweet dreams! Moo feels rested!",
};

export default function App() {
  const [game, setGame] = useState(loadGame);
  const [reaction, setReaction] = useState("");

  const reactionTimer = useRef(null);

  const { stats, theme } = game;

  const background = `${
    import.meta.env.BASE_URL
  }art/backgrounds/${
    theme === "dark"
      ? "BGdarkmode.JPG"
      : "BGlightmode.JPG"
  }`;

  // Save updated game progress.
  useEffect(() => {
    saveGame(game);
  }, [game]);

  // Update needs every 15 seconds while visible.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") {
        setGame((current) => advanceGame(current));
      }
    };

    const timer = setInterval(tick, 15000);

    window.addEventListener("focus", tick);

    document.addEventListener(
      "visibilitychange",
      tick
    );

    return () => {
      clearInterval(timer);

      window.removeEventListener("focus", tick);

      document.removeEventListener(
        "visibilitychange",
        tick
      );
    };
  }, []);

  // Clean up the reaction timer.
  useEffect(() => {
    return () => {
      clearTimeout(reactionTimer.current);
    };
  }, []);

  function showReaction(message) {
    clearTimeout(reactionTimer.current);

    setReaction(message);

    reactionTimer.current = setTimeout(() => {
      setReaction("");
    }, 1600);
  }

  // Feed, Pet, Play, Sleep.
  function handleAction(action) {
    const current = advanceGame(game);

    if (
      action === "play" &&
      current.stats.energy < 15
    ) {
      setGame(current);

      showReaction(
        "Moo is too tired to play! Try sleeping."
      );

      return;
    }

    setGame((previous) => {
      const updated = advanceGame(previous);

      return {
        ...updated,
        stats: performAction(
          updated.stats,
          action
        ),
      };
    });

    showReaction(
      ACTION_MESSAGES[action] || "Moo!"
    );
  }

  // Switch your original background artwork.
  function toggleTheme() {
    setGame((previous) => ({
      ...advanceGame(previous),
      theme:
        previous.theme === "light"
          ? "dark"
          : "light",
    }));
  }

  return (
    <div
      className={`moo-app moo-app--${theme}`}
      style={{
        backgroundImage: `url("${background}")`,
      }}
    >
      <div className="moo-container">

        {/* Header */}
        <header className="moo-header">
          <div className="moo-brand">
            <span
              className="moo-brand__symbol"
              aria-hidden="true"
            >
              M
            </span>

            <div className="moo-brand__text">
              <h1>Moo</h1>
              <p>Your little virtual friend</p>
            </div>
          </div>

          <button
            className="moo-theme-button"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to night mode"
                : "Switch to day mode"
            }
          >
            <span aria-hidden="true">
              {theme === "light" ? "☾" : "☀"}
            </span>

            <span>
              {theme === "light"
                ? "Night Mode"
                : "Day Mode"}
            </span>
          </button>
        </header>

        {/* Game */}
        <main className="moo-playground">

          <div className="moo-stage-wrap">
            <CowStage
              stats={stats}
              reaction={reaction}
            />
          </div>

          {/* Care panel */}
          <section
            className="moo-panel"
            aria-label="Moo's care controls"
          >
            <div className="moo-panel__heading">
              <h2>Take care of Moo</h2>

              <span
                className="moo-panel__heart"
                aria-hidden="true"
              >
                ♥
              </span>
            </div>

            <div className="moo-stats">
              <StatMeter
                type="fullness"
                value={stats.fullness}
              />

              <StatMeter
                type="happiness"
                value={stats.happiness}
              />

              <StatMeter
                type="energy"
                value={stats.energy}
              />
            </div>

            <div className="moo-actions-section">
              <ActionButtons
                onAction={handleAction}
              />
            </div>
          </section>

        </main>

        {/* Centered footer */}
        <footer className="moo-footer">
          <p>Made with love for Moo.</p>
        </footer>

      </div>
    </div>
  );
}
