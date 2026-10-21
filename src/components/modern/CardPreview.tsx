import { type CSSProperties } from "react";
import { themes, type CardContent } from "@/lib/cards";
import JoyCharacter from "./JoyCharacter";
export default function CardPreview({ card }: { card: CardContent }) {
  const theme = themes[card.theme as keyof typeof themes] ?? themes.midnight;
  return (
    <article
      className="composed-card"
      aria-label="Live card preview"
      style={
        {
          "--card-background": theme.background,
          "--card-accent": theme.accent,
          "--card-glow": theme.glow,
        } as CSSProperties
      }
    >
      <div className="composed-top">
        <span>{card.purpose}</span>
        <span>✦</span>
      </div>
      <JoyCharacter
        kind={
          card.purpose === "invitation"
            ? "star"
            : card.purpose === "greeting"
              ? "heart"
              : "orb"
        }
        className="preview-character"
      />
      {card.recipient && (
        <p className="composed-recipient">For {card.recipient}</p>
      )}
      <h2>{card.title || "Your title goes here"}</h2>
      <p className="composed-message">
        {card.message || "Your words, beautifully yours."}
      </p>
      {(card.eventDate || card.location) && (
        <div className="composed-event">
          {card.eventDate && (
            <p>
              <time dateTime={card.eventDate}>
                {card.eventDate.replace("T", " · ")}
              </time>{" "}
              <span>({card.timezone})</span>
            </p>
          )}
          {card.location && <p>{card.location}</p>}
        </div>
      )}
      {card.checklist.length > 0 && (
        <ul className="card-checklist">
          {card.checklist.map((item, i) => (
            <li key={i}>
              <label>
                <input type="checkbox" />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}
      {card.details && (
        <details className="card-details">
          <summary>There’s a little more…</summary>
          <p>{card.details}</p>
        </details>
      )}
      {card.actions.length > 0 && (
        <div className="card-actions">
          {card.actions.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">
              {a.label} ↗
            </a>
          ))}
        </div>
      )}
      <div className="composed-footer">
        a little message, a lasting feeling. <strong>congratss.</strong>
      </div>
    </article>
  );
}
