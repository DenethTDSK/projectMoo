
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ACTIONS,
  ACTION_COOLDOWN_MS,
} from "../game/petLogic";

import "./ActionButtons.css";

const ICONS = {
  feed: "Food.PNG",
  pet: "Pet.PNG",
  play: "Play.PNG",
  sleep: "Sleep.PNG",
};

export default function ActionButtons({ onAction }) {
  const [busy, setBusy] = useState(false);

  const lastClick = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleClick(action) {
    const now = Date.now();

    if (
      busy ||
      now - lastClick.current < ACTION_COOLDOWN_MS
    ) {
      return;
    }

    lastClick.current = now;

    setBusy(true);
    onAction(action);

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setBusy(false);
    }, ACTION_COOLDOWN_MS);
  }

  return (
    <div className="action-buttons">
      {Object.keys(ICONS).map((action) => (
        <button
          type="button"
          key={action}
          className={`action-button action-button--${action}`}
          disabled={busy}
          onClick={() => handleClick(action)}
          aria-label={ACTIONS[action].label}
        >
          <img
            src={`${
              import.meta.env.BASE_URL
            }art/icons/${ICONS[action]}`}
            className="action-button__icon"
            alt=""
            decoding="async"
            draggable={false}
          />

          <span className="action-button__label">
            {ACTIONS[action].label}
          </span>
        </button>
      ))}
    </div>
  );
}
