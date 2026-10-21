"use client";
import { useId } from "react";

/** Original Congratss vector characters. No third-party emoji art or runtime 3D dependency. */
export default function JoyCharacter({
  kind = "orb",
  className = "",
}: {
  kind?: "orb" | "heart" | "star";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const colors =
    kind === "heart"
      ? ["#ffb7df", "#f54da7", "#9a2469"]
      : kind === "star"
        ? ["#fff4bc", "#ffc966", "#e68a4b"]
        : ["#bfb5ff", "#8b67f6", "#403087"];
  const shape =
    kind === "heart"
      ? "M130 226C102 204 32 157 32 99C32 48 94 29 130 77C166 29 228 48 228 99C228 157 158 204 130 226Z"
      : kind === "star"
        ? "M130 24Q138 23 144 42L162 88L213 91Q237 93 219 111L180 148L193 201Q198 225 176 212L130 183L84 212Q62 225 67 201L80 148L41 111Q23 93 47 91L98 88L116 42Q122 23 130 24Z"
        : "M130 30C192 30 231 72 231 129C231 194 186 230 130 230C68 230 29 189 29 129C29 69 71 30 130 30Z";
  return (
    <svg
      className={className}
      viewBox="0 0 260 270"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}body`} cx="0.3" cy="0.19" r="0.85">
          <stop stopColor={colors[0]} />
          <stop offset=".5" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} />
        </radialGradient>
        <linearGradient
          id={`${id}shine`}
          x1="70"
          y1="40"
          x2="150"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity=".75" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}shadow`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <ellipse
        cx="130"
        cy="250"
        rx="70"
        ry="9"
        fill={colors[1]}
        opacity=".25"
        filter={`url(#${id}shadow)`}
      />
      <path
        d={shape}
        fill={`url(#${id}body)`}
        stroke={colors[0]}
        strokeWidth="1.4"
      />
      <path
        d={
          kind === "heart"
            ? "M48 101C48 65 87 58 106 80"
            : kind === "star"
              ? "M119 54L108 94L69 101"
              : "M53 105C60 59 105 43 138 47"
        }
        stroke={`url(#${id}shine)`}
        strokeWidth="15"
        strokeLinecap="round"
      />
      <ellipse cx="101" cy="131" rx="8" ry="12" fill="#271936" />
      <ellipse cx="157" cy="131" rx="8" ry="12" fill="#271936" />
      <circle cx="99" cy="127" r="2.5" fill="white" />
      <circle cx="155" cy="127" r="2.5" fill="white" />
      <path
        d="M115 155Q130 172 145 155"
        stroke="#382043"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="80" cy="150" rx="12" ry="6" fill="#ff9ac7" opacity=".65" />
      <ellipse cx="178" cy="150" rx="12" ry="6" fill="#ff9ac7" opacity=".65" />
    </svg>
  );
}
