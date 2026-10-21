import { z } from "zod";
export const purposes = [
  "greeting",
  "invitation",
  "announcement",
  "instructions",
  "reminder",
  "business",
  "custom",
];
export const themes = {
  midnight: {
    name: "Midnight",
    background: "#111128",
    accent: "#a78bfa",
    glow: "#393078",
  },
  bloom: {
    name: "Pink bloom",
    background: "#281325",
    accent: "#f9a8d4",
    glow: "#87345e",
  },
  ocean: {
    name: "Electric blue",
    background: "#0b2038",
    accent: "#67e8f9",
    glow: "#145b89",
  },
  paper: {
    name: "Soft violet",
    background: "#211c35",
    accent: "#ddd6fe",
    glow: "#64508c",
  },
};
export const actionSchema = z
  .object({
    label: z.string().trim().min(1).max(40),
    url: z
      .string()
      .trim()
      .max(2048)
      .refine((value) => {
        try {
          const url = new URL(value);
          if (url.protocol === "https:") return !url.username && !url.password;
          if (url.protocol === "mailto:")
            return /^mailto:[^\s?@]+@[^\s?@]+\.[^\s?@]+$/.test(value);
          if (url.protocol === "tel:")
            return /^tel:\+?[\d ()-]{7,25}$/.test(value);
        } catch {
          return false;
        }
        return false;
      }, "Use an HTTPS link, mailto: email address, or tel: phone number."),
  })
  .strict();
export const cardSchema = z
  .object({
    schemaVersion: z.literal(1),
    purpose: z.enum(purposes),
    title: z.string().trim().min(1, "Add a title.").max(120),
    recipient: z.string().trim().max(80).default(""),
    message: z
      .string()
      .min(1, "Write your message.")
      .max(2400)
      .refine((v) => v.trim().length > 0, "Write your message."),
    details: z.string().max(4000).default(""),
    checklist: z.array(z.string().trim().min(1).max(160)).max(12).default([]),
    actions: z.array(actionSchema).max(3).default([]),
    theme: z.enum(Object.keys(themes)),
    eventDate: z
      .string()
      .max(40)
      .refine((v) => {
        if (!v) return true;
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return false;
        const date = new Date(`${v}:00Z`);
        return (
          !Number.isNaN(date.getTime()) && date.toISOString().startsWith(v)
        );
      }, "Choose a valid local date and time.")
      .default(""),
    timezone: z
      .string()
      .max(80)
      .refine((v) => {
        try {
          new Intl.DateTimeFormat("en", { timeZone: v });
          return true;
        } catch {
          return false;
        }
      }, "Use an IANA timezone, such as America/New_York.")
      .default("UTC"),
    location: z.string().trim().max(200).default(""),
  })
  .strict();
export const initialCard = {
  schemaVersion: 1,
  purpose: "greeting",
  title: "A little joy, just for you.",
  recipient: "",
  message:
    "Some people make the ordinary feel extraordinary. You are one of them. ✨",
  details: "",
  checklist: [],
  actions: [],
  theme: "midnight",
  eventDate: "",
  timezone: "UTC",
  location: "",
};
export const templates = [
  {
    id: "little-joy",
    name: "A little joy",
    tag: "greeting",
    theme: "midnight",
    title: "A little joy, just for you.",
    message: initialCard.message,
  },
  {
    id: "after-hours",
    name: "After hours",
    tag: "invitation",
    theme: "bloom",
    title: "Good people. Great evening.",
    message:
      "You’re invited. Bring yourself — we’ll take care of the good vibes.",
  },
  {
    id: "big-news",
    name: "The big reveal",
    tag: "announcement",
    theme: "ocean",
    title: "Something wonderful is here.",
    message:
      "We’ve been working on something special. We’re so excited to finally share it with you.",
  },
  {
    id: "step-by-step",
    name: "Make it simple",
    tag: "instructions",
    theme: "paper",
    title: "A little guide to getting started.",
    message: "Everything you need, one step at a time.",
    checklist: [
      "Start with the essentials",
      "Take the next small step",
      "Celebrate your progress",
    ],
  },
  {
    id: "gentle-nudge",
    name: "A gentle nudge",
    tag: "reminder",
    theme: "ocean",
    title: "A little reminder.",
    message:
      "Saving a moment for something that matters. Here are the details.",
  },
  {
    id: "hello-business",
    name: "A better introduction",
    tag: "business",
    theme: "midnight",
    title: "Good things start with hello.",
    message: "Let’s make something great together. Here’s how to find me.",
  },
  {
    id: "your-words",
    name: "Your words, your way",
    tag: "custom",
    theme: "bloom",
    title: "This one is for you.",
    message: "Start with something real. Make it yours.",
  },
];
export function fromTemplate(id) {
  const t = templates.find((t) => t.id === id);
  if (!t) throw new Error("Unknown template");
  return cardSchema.parse({
    ...initialCard,
    purpose: t.tag,
    theme: t.theme,
    title: t.title,
    message: t.message,
    checklist: t.checklist ?? [],
  });
}
export function shareLinks(url, title) {
  const text = encodeURIComponent(`${title}\n${url}`);
  return {
    whatsapp: `https://wa.me/?text=${text}`,
    sms: `sms:?&body=${text}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${text}`,
  };
}
