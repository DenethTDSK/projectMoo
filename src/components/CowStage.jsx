
import { getCowMood } from "../game/petLogic";
import "./CowStage.css";

const MOOD_MESSAGES = {
  Normal: "Moo is enjoying the day!",
  Happy: "Moo is feeling wonderful!",
  Hungry: "Moo is getting hungry!",
  Sad: "Moo needs some love!",
  Sleepy: "Moo is ready for a nap!",
};

export default function CowStage({
  stats,
  reaction = "",
}) {
  const mood = getCowMood(stats);

  const image = `${
    import.meta.env.BASE_URL
  }art/cow/${mood}.PNG`;

  return (
    <section
      className="cow-stage"
      aria-label="Moo's home"
    >
      <div className="cow-stage__character">
        <img
          src={image}
          alt={`Moo looking ${mood.toLowerCase()}`}
          className="cow-stage__image"
          draggable={false}
          decoding="async"
        />
      </div>

      <div
        className="cow-stage__speech"
        role="status"
        aria-live="polite"
      >
        {reaction || MOOD_MESSAGES[mood]}
      </div>
    </section>
  );
}
