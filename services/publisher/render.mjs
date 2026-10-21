import sharp from "sharp";
import { themes } from "../../shared/card.mjs";
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const publicCss = `*{box-sizing:border-box}body{margin:0;background:#080810;color:#faf9ff;font-family:Arial,sans-serif;line-height:1.7;padding:32px 20px}main{max-width:650px;margin:auto}article{background:radial-gradient(at top right,var(--glow),var(--background) 80%);border:1px solid #ffffff30;border-radius:26px;padding:38px;overflow-wrap:anywhere}header,footer{display:flex;justify-content:space-between;gap:15px;color:var(--accent);font-size:11px}header{text-transform:uppercase;letter-spacing:2px}h1{font-size:clamp(30px,7vw,46px);line-height:1.15;letter-spacing:-1.5px;margin:25px 0}p.message,p.details{white-space:pre-wrap}details{border:1px solid #ffffff30;border-radius:10px;padding:14px;margin:24px 0}summary{cursor:pointer;color:var(--accent);min-height:32px}ul{list-style:none;padding:0}li{padding:8px 0}label{display:flex;gap:10px;align-items:baseline}input{accent-color:var(--accent)}nav{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}a.button{background:var(--accent);color:#161021;border-radius:10px;padding:12px 18px;font-weight:bold;font-size:13px}a{color:#d8c7ff;text-decoration:none}a:focus-visible,summary:focus-visible,input:focus-visible{outline:3px solid #67e8f9;outline-offset:5px}.brand{text-align:center;font-size:13px;display:block;margin-bottom:25px;color:#c4aff4}.art{display:block;width:110px;margin:25px auto}footer{border-top:1px solid #ffffff25;margin-top:30px;padding-top:18px;font-size:10px}.page-actions{font-size:12px;display:flex;justify-content:center;gap:25px;margin-top:25px}.note{text-align:center;font-size:10px;color:#b0a4c2}.event{color:var(--accent);font-size:13px}time{font-variant-numeric:tabular-nums}@media(max-width:480px){article{padding:25px}body{padding:20px 16px}}`;
export function renderHtml(card, url, imageUrl, appOrigin) {
  const t = themes[card.theme];
  const event = [
    card.eventDate
      ? `${card.eventDate.replace("T", " · ")} (${card.timezone})`
      : "",
    card.location,
  ]
    .filter(Boolean)
    .join(" — ");
  const details = card.details
    ? `<details><summary>There’s a little more…</summary><p class="details">${escape(card.details)}</p></details>`
    : "";
  const checks = card.checklist.length
    ? `<ul>${card.checklist.map((v, i) => `<li><label><input type="checkbox" aria-label="${escape(v)}" id="item-${i}">${escape(v)}</label></li>`).join("")}</ul>`
    : "";
  const buttons = card.actions.length
    ? `<nav aria-label="Card actions">${card.actions.map((a) => `<a class="button" href="${escape(a.url)}" target="_blank" rel="noopener noreferrer">${escape(a.label)} ↗</a>`).join("")}</nav>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(card.title)} · Congratss</title><meta name="description" content="${escape(card.message.slice(0, 180))}"><link rel="canonical" href="${escape(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="Congratss"><meta property="og:title" content="${escape(card.title)}"><meta property="og:description" content="${escape(card.message.slice(0, 180))}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(imageUrl)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(card.title)}"><meta name="twitter:card" content="summary_large_image"><meta name="robots" content="noindex,nofollow"><style>${publicCss}</style></head><body><main><a class="brand" href="${escape(appOrigin)}">congratss. ✦</a><article style="--background:${t.background};--accent:${t.accent};--glow:${t.glow}"><header><span>${escape(card.purpose)}</span><span>✦</span></header><img class="art" width="110" height="110" src="${escape(url)}/character.svg" alt="Original smiling Congratss character">${card.recipient ? `<p>For ${escape(card.recipient)}</p>` : ""}<h1>${escape(card.title)}</h1><p class="message">${escape(card.message)}</p>${event ? `<p class="event">${escape(event)}</p>` : ""}${checks}${details}${buttons}<footer><span>a little message, a lasting feeling.</span><strong>congratss.</strong></footer></article><div class="page-actions"><a href="${escape(url)}/image.png?download=1">Download card image</a><a href="${escape(appOrigin)}/create">Create your own ↗</a></div><p class="note">Shared by its creator. This card is public to anyone with the link.<br>Checklists are private to this visit; responses are not recorded.</p></main></body></html>`;
}
export function characterSvg(color = "#a78bfa") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g" cx=".3" cy=".2" r=".9"><stop stop-color="#ede5ff"/><stop offset=".45" stop-color="${color}"/><stop offset="1" stop-color="#39245e"/></radialGradient></defs><circle cx="100" cy="100" r="88" fill="url(#g)"/><path d="M38 70Q55 27 105 28" fill="none" stroke="#ffffff70" stroke-width="10" stroke-linecap="round"/><ellipse cx="76" cy="95" rx="7" ry="10" fill="#231334"/><ellipse cx="124" cy="95" rx="7" ry="10" fill="#231334"/><path d="M87 120Q100 135 113 120" fill="none" stroke="#231334" stroke-width="4" stroke-linecap="round"/><ellipse cx="58" cy="114" rx="12" ry="6" fill="#ffacd3" opacity=".65"/><ellipse cx="142" cy="114" rx="12" ry="6" fill="#ffacd3" opacity=".65"/></svg>`;
}
export async function renderPng(card, preview = false) {
  const t = themes[card.theme];
  const width = preview ? 1200 : 1080;
  const blocks = preview
    ? [
        {
          text: card.recipient
            ? `For ${card.recipient}`
            : "A little message. A lasting feeling.",
          size: 23,
          max: 60,
          color: t.accent,
        },
        { text: card.title.slice(0, 100), size: 46, max: 34, color: "#ffffff" },
        {
          text: card.message.slice(0, 120),
          size: 22,
          max: 80,
          color: "#e9e0f8",
        },
      ]
    : [
        ...(card.recipient
          ? [
              {
                text: `For ${card.recipient}`,
                size: 26,
                max: 50,
                color: t.accent,
              },
            ]
          : []),
        { text: card.title, size: 54, max: 29, color: "#ffffff" },
        { text: card.message, size: 30, max: 51, color: "#eee7fa" },
        ...[
          card.eventDate
            ? `${card.eventDate.replace("T", " · ")} (${card.timezone})`
            : "",
          card.location,
        ]
          .filter(Boolean)
          .map((text) => ({ text, size: 25, max: 58, color: t.accent })),
        ...card.checklist.map((text) => ({
          text: `☐ ${text}`,
          size: 27,
          max: 54,
          color: "#eee7fa",
        })),
        ...(card.details
          ? [
              { text: "More details", size: 25, max: 58, color: t.accent },
              { text: card.details, size: 27, max: 56, color: "#eee7fa" },
            ]
          : []),
        ...card.actions.map((a) => ({
          text: `${a.label} ↗ (open the card to interact)`,
          size: 24,
          max: 58,
          color: t.accent,
        })),
      ];
  // Pango wraps using actual glyph metrics, including long words and wide Unicode.
  const layers = [];
  let y = preview ? 95 : 320;
  for (const [index, block] of blocks.entries()) {
    let value = block.text || " ";
    let layer;
    do {
      layer = await sharp({
        text: {
          text: `<span foreground="${block.color}">${escape(value)}</span>`,
          font: `DejaVu Sans ${block.size}`,
          width: width - 160,
          rgba: true,
          dpi: 72,
          wrap: "word-char",
          spacing: 10,
        },
      })
        .png()
        .toBuffer({ resolveWithObject: true });
      if (preview && index === 1 && layer.info.height > 185)
        value = value.slice(0, -5) + "…";
      else break;
    } while (value.length > 5);
    layers.push({ input: layer.data, left: 80, top: Math.ceil(y) });
    y += layer.info.height + 28;
  }
  const height = preview ? 630 : Math.max(1000, Math.ceil(y + 130));
  const art = preview
    ? ""
    : `<image x="430" y="80" width="220" height="220" href="data:image/svg+xml;base64,${Buffer.from(characterSvg(t.accent)).toString("base64")}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="bg" cx="1" cy="0" r="1"><stop stop-color="${t.glow}"/><stop offset="1" stop-color="${t.background}"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/><rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="32" fill="none" stroke="#ffffff40"/><g font-family="DejaVu Sans,sans-serif"><text x="80" y="75" fill="${t.accent}" font-size="20">CONGRATSS · ${escape(card.purpose.toUpperCase())}</text>${art}<text x="80" y="${height - 60}" fill="${t.accent}" font-size="20">a little message, a lasting feeling.                         congratss.</text></g></svg>`;
  return sharp(Buffer.from(svg), { limitInputPixels: 40000000 })
    .composite(layers)
    .png()
    .toBuffer();
}
