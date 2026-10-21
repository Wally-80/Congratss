"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Link2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  accountDrafts,
  localDrafts,
  saveAccountDraft,
  saveLocalDraft,
  type Draft,
} from "@/lib/cardDrafts";
import {
  actionSchema,
  cardSchema,
  fromTemplate,
  initialCard,
  purposes,
  shareLinks,
  templates,
  themes,
  type CardContent,
} from "@/lib/cards";
import CardPreview from "./CardPreview";
import { publisherOrigin } from "@/lib/publisher";
const purposeLabels: Record<string, string> = {
  greeting: "Greetings",
  invitation: "Invitations",
  announcement: "Announcements",
  instructions: "Instructions",
  reminder: "Reminders",
  business: "Business",
  custom: "Anything else",
};
const publisher = publisherOrigin(process.env.NEXT_PUBLIC_PUBLISHER_URL);
const subscribeReady = () => () => {};
export default function CardCreator() {
  const { user, loading } = useAuth();
  const ready = useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
  if (!ready || loading)
    return (
      <main className="creator-main" id="main" aria-busy="true">
        Loading your creator…
      </main>
    );
  return <CardEditor key={user?.uid || "guest"} user={user} />;
}
function CardEditor({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  const [card, setCard] = useState<CardContent>(() => {
    const id = new URLSearchParams(window.location.search).get("template");
    return id && templates.some((t) => t.id === id)
      ? fromTemplate(id)
      : cardSchema.parse(initialCard);
  });
  const [drafts, setDrafts] = useState<Draft[]>(() => localDrafts(user?.uid));
  const [draftId, setDraftId] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [publications, setPublications] = useState<
    { id: string; url: string; imageUrl: string; title: string }[]
  >([]);
  const [published, setPublished] = useState<{
    id: string;
    url: string;
    imageUrl: string;
  } | null>(null);
  const [consent, setConsent] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const activeUid = useRef(user?.uid);
  const publishKey = useRef("");
  const dirty = useRef(false);
  const error =
    status.startsWith("Could not") ||
    status.startsWith("Please") ||
    status.startsWith("Add ") ||
    status.startsWith("Use ");
  useEffect(() => {
    activeUid.current = user?.uid;
    let cancelled = false;
    if (user && publisher)
      void user
        .getIdToken()
        .then((token) =>
          fetch(`${publisher}/api/cards`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        )
        .then(async (response) => {
          if (!response.ok) throw new Error("Publication lookup failed");
          const values = await response.json();
          if (!cancelled) setPublications(values);
        })
        .catch(() => {
          if (!cancelled)
            setStatus(
              "Could not load published cards. Your drafts remain available.",
            );
        });
    if (user)
      void accountDrafts(user.uid)
        .then((values) => {
          if (!cancelled) setDrafts(values);
        })
        .catch(() => {
          if (!cancelled)
            setStatus(
              "Could not load account drafts. Device drafts are still available.",
            );
        });
    return () => {
      cancelled = true;
      activeUid.current = undefined;
    };
  }, [user]);
  function edit<K extends keyof CardContent>(field: K, value: CardContent[K]) {
    dirty.current = true;
    setCard((previous) => ({ ...previous, [field]: value }));
    setConsent(false);
    publishKey.current = "";
  }
  function applyTemplate(id: string) {
    if (
      !window.confirm(
        "Replace this preview with the selected template? Save your draft first to keep your current words.",
      )
    )
      return;
    publishKey.current = "";
    dirty.current = true;
    setCard(fromTemplate(id));
    setDraftId("");
    setConsent(false);
    setStatus("Template applied. Make it your own.");
  }
  async function save() {
    const parsed = cardSchema.safeParse(card);
    if (!parsed.success) {
      setStatus(parsed.error.issues[0].message);
      return;
    }
    const uid = user?.uid;
    setBusy(true);
    const draft = {
      id: draftId || crypto.randomUUID(),
      content: parsed.data,
      updatedAt: new Date().toISOString(),
    };
    try {
      saveLocalDraft(draft, uid);
      if (uid) await saveAccountDraft(draft, uid);
      if (activeUid.current !== uid) return;
      dirty.current = false;
      setDraftId(draft.id);
      setDrafts([draft, ...drafts.filter((d) => d.id !== draft.id)]);
      setStatus(
        uid
          ? "Draft saved to your account and this device."
          : "Draft saved on this device. Sign in to save across devices.",
      );
    } catch {
      setStatus(
        "Could not finish saving to your account. Check your connection; a device copy may be available.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    const parsed = cardSchema.safeParse(card);
    if (!parsed.success) {
      setStatus(parsed.error.issues[0].message);
      return;
    }
    if (!publisher || !user || !consent) return;
    setBusy(true);
    setStatus("Publishing your card…");
    try {
      const token = await user.getIdToken();
      publishKey.current ||= crypto.randomUUID();
      const response = await fetch(`${publisher}/api/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": publishKey.current,
        },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Publishing unavailable.");
      if (activeUid.current !== user.uid) return;
      setPublished(data);
      setPublications((previous) => [
        { ...data, title: parsed.data.title },
        ...previous.filter((item) => item.id !== data.id),
      ]);
      publishKey.current = "";
      setShareOpen(true);
      setStatus(
        "Published. Anyone with this link can view this snapshot. Later edits need a new link.",
      );
    } catch (e) {
      setStatus(
        `Could not publish: ${e instanceof Error ? e.message : "try again."}`,
      );
    } finally {
      setBusy(false);
    }
  }
  async function revoke() {
    if (
      !published ||
      !user ||
      !window.confirm(
        "Revoke this public card link? Copies and previews already shared may remain.",
      )
    )
      return;
    setBusy(true);
    try {
      const response = await fetch(`${publisher}/api/cards/${published.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (!response.ok) throw new Error("Revocation failed");
      setPublications((previous) =>
        previous.filter((item) => item.id !== published.id),
      );
      setPublished(null);
      setShareOpen(false);
      setStatus(
        "Public link revoked. Copies already downloaded cannot be removed.",
      );
    } catch {
      setStatus("Could not revoke the card. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(published!.url);
      setStatus("Public card link copied.");
    } catch {
      setStatus(
        "Could not copy automatically. Select the public link below and copy it.",
      );
    }
  }
  async function deviceShare() {
    if (!published) return;
    try {
      if (navigator.share)
        await navigator.share({ title: "A card for you", url: published.url });
      else await copy();
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError"))
        setStatus("Could not open sharing. Copy the link instead.");
    }
  }
  const links = published ? shareLinks(published.url, "A card for you") : null;
  return (
    <main className="creator-main" id="main">
      <div className="creator-heading">
        <div>
          <p className="eyebrow">A LITTLE THOUGHT. A BEAUTIFUL DELIVERY.</p>
          <h1>
            Make it <span>meaningful.</span>
          </h1>
          <p>Your words stay yours. No automatic AI rewriting.</p>
        </div>
        <button className="secondary-button" onClick={save} disabled={busy}>
          <Save size={16} /> Save draft
        </button>
      </div>
      <div className="creator-grid">
        <fieldset className="editor-panel" aria-label="Card editor">
          <div className="editor-section">
            <h2>
              <span>01</span> What’s the occasion?
            </h2>
            <div className="purpose-options">
              {purposes.map((p) => (
                <button
                  key={p}
                  aria-pressed={card.purpose === p}
                  onClick={() => edit("purpose", p)}
                >
                  {purposeLabels[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="editor-section">
            <h2>
              <span>02</span> Find your starting point
            </h2>
            <div className="template-options">
              {templates
                .filter((t) => t.tag === card.purpose)
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    style={{
                      borderColor:
                        themes[t.theme as keyof typeof themes].accent,
                    }}
                  >
                    <span>✦</span>
                    {t.name}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
            </div>
            <p className="field-hint">
              Templates replace the preview only when you choose to apply them.
            </p>
          </div>
          <div className="editor-section">
            <h2>
              <span>03</span> Say it your way
            </h2>
            <label className="field">
              For someone special <span>Optional</span>
              <input
                maxLength={80}
                value={card.recipient}
                onChange={(e) => edit("recipient", e.target.value)}
                placeholder="Their name, your team, everyone…"
              />
            </label>
            <label className="field">
              Title
              <input
                maxLength={120}
                value={card.title}
                onChange={(e) => edit("title", e.target.value)}
              />
            </label>
            <label className="field">
              Your message
              <textarea
                rows={5}
                maxLength={2400}
                value={card.message}
                onChange={(e) => edit("message", e.target.value)}
              />
              <span className="field-counter">{card.message.length}/2400</span>
            </label>
            {["invitation", "reminder"].includes(card.purpose) && (
              <div className="event-fields">
                <label className="field">
                  Date and time
                  <input
                    type="datetime-local"
                    value={card.eventDate}
                    onChange={(e) => edit("eventDate", e.target.value)}
                  />
                </label>
                <label className="field">
                  Timezone
                  <input
                    maxLength={80}
                    value={card.timezone}
                    onChange={(e) => edit("timezone", e.target.value)}
                    placeholder="America/New_York"
                  />
                </label>
                <label className="field">
                  Location or meeting details
                  <input
                    maxLength={200}
                    value={card.location}
                    onChange={(e) => edit("location", e.target.value)}
                  />
                </label>
              </div>
            )}
            <label className="field">
              Expandable details <span>Optional</span>
              <textarea
                rows={3}
                maxLength={4000}
                value={card.details}
                onChange={(e) => edit("details", e.target.value)}
                placeholder="A little more information, tucked away until they open it."
              />
            </label>
            <label className="field">
              Checklist <span>One item per line, up to 12</span>
              <textarea
                rows={3}
                value={card.checklist.join("\n")}
                onChange={(e) =>
                  edit("checklist", e.target.value.split("\n").slice(0, 12))
                }
                placeholder="Your first step"
              />
            </label>
          </div>
          <div className="editor-section">
            <h2>
              <span>04</span> Set the mood
            </h2>
            <div className="theme-options">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  aria-pressed={card.theme === key}
                  onClick={() => edit("theme", key)}
                >
                  <span
                    style={{
                      background: `linear-gradient(135deg,${theme.glow},${theme.background})`,
                    }}
                  />
                  {theme.name}
                  {card.theme === key && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
          <div className="editor-section">
            <h2>
              <span>05</span> Add a little interaction
            </h2>
            <p className="field-hint">
              Link to an RSVP form, calendar event, website, email, or phone
              number. Responses happen at that destination.
            </p>
            {card.actions.map((action, i) => (
              <div className="action-editor" key={i}>
                <label className="field">
                  Button {i + 1} label
                  <input
                    value={action.label}
                    maxLength={40}
                    onChange={(e) =>
                      edit(
                        "actions",
                        card.actions.map((a, n) =>
                          n === i ? { ...a, label: e.target.value } : a,
                        ),
                      )
                    }
                  />
                </label>
                <label className="field">
                  Button {i + 1} destination
                  <input
                    value={action.url}
                    maxLength={2048}
                    placeholder="https://… · mailto:… · tel:…"
                    onChange={(e) =>
                      edit(
                        "actions",
                        card.actions.map((a, n) =>
                          n === i ? { ...a, url: e.target.value } : a,
                        ),
                      )
                    }
                  />
                </label>
                <button
                  className="icon-button"
                  aria-label={`Remove button ${i + 1}`}
                  onClick={() =>
                    edit(
                      "actions",
                      card.actions.filter((_, n) => n !== i),
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              className="secondary-button"
              disabled={card.actions.length >= 3}
              onClick={() =>
                edit("actions", [
                  ...card.actions,
                  { label: "Let’s connect", url: "https://example.com" },
                ])
              }
            >
              <Plus size={15} /> Add button
            </button>
          </div>
          <div className="editor-section">
            <h2>Your drafts</h2>
            <p className="field-hint">
              {user
                ? "Account drafts, plus a device copy when saved here."
                : "Stored in this browser. They are not public."}
            </p>
            {drafts.length === 0 ? (
              <p className="empty-drafts">
                A little inspiration worth keeping? Save your first draft.
              </p>
            ) : (
              <ul className="draft-list">
                {drafts.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => {
                        if (
                          dirty.current &&
                          !window.confirm(
                            "Replace your unsaved preview with this draft?",
                          )
                        )
                          return;
                        dirty.current = false;
                        publishKey.current = "";
                        setCard(d.content);
                        setDraftId(d.id);
                        setConsent(false);
                        setStatus("Draft loaded.");
                      }}
                    >
                      {d.content.title}
                      <span>Open draft ↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!user && (
              <Link className="text-cta" href="/auth?next=/create">
                Sign in for account drafts <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
          {publications.length > 0 && (
            <div className="editor-section">
              <h2>Published cards</h2>
              <p className="field-hint">
                Choose a public snapshot to share or revoke its link. Showing up
                to 50 active publications.
              </p>
              <ul className="draft-list">
                {publications.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setPublished(item);
                        setShareOpen(true);
                        setStatus(
                          "Published snapshot selected. Editor changes do not change this link.",
                        );
                      }}
                    >
                      {item.title}
                      <span>Share or revoke ↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </fieldset>
        <aside className="preview-panel" aria-label="Preview and publishing">
          <div className="preview-sticky">
            <div className="preview-heading">
              <span className="status-dot" /> LIVE PREVIEW{" "}
              <span>Your next little masterpiece</span>
            </div>
            <CardPreview
              card={{
                ...card,
                actions: card.actions.filter(
                  (a) => actionSchema.safeParse(a).success,
                ),
              }}
            />
            <div className="publish-panel">
              <h2>Ready to make their day?</h2>
              <p>
                Publishing creates a public snapshot. Anyone with the link can
                view it. Keep private information out of your card.
              </p>
              {!publisher && (
                <p className="configuration-note">
                  Public publishing is not connected in this environment yet.
                  You can create, preview, and save drafts.
                </p>
              )}
              {!user && (
                <Link href="/auth?next=/create" className="text-cta">
                  Sign in to publish <ArrowUpRight size={15} />
                </Link>
              )}
              <label className="publish-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I’m ready to make this card public.
              </label>
              <button
                className="primary-cta"
                disabled={!publisher || !user || !consent || busy}
                onClick={publish}
              >
                {busy ? (
                  <Loader2 size={17} className="busy-spinner" />
                ) : (
                  <Link2 size={17} />
                )}{" "}
                Publish card <ArrowUpRight size={17} />
              </button>
              {published && (
                <div className="share-panel">
                  <p>Your published snapshot</p>
                  <input
                    aria-label="Public card URL"
                    readOnly
                    value={published.url}
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    className="secondary-button"
                    onClick={() => setShareOpen(!shareOpen)}
                  >
                    Share options
                  </button>
                  {shareOpen && (
                    <div className="share-options">
                      <button onClick={copy}>
                        <Copy size={14} /> Copy link
                      </button>
                      <button onClick={deviceShare}>
                        iMessage / Share with device ↗
                      </button>
                      <a
                        href={links!.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp ↗
                      </a>
                      <a href={links!.sms}>SMS ↗</a>
                      <a href={links!.email}>Email ↗</a>
                      <a href={`${published.imageUrl}?download=1`}>
                        <Download size={14} /> Download card image
                      </a>
                      <a
                        href={published.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View public card ↗
                      </a>
                      <button onClick={revoke} disabled={busy}>
                        Revoke this public link
                      </button>
                    </div>
                  )}
                  <p className="field-hint">
                    Your messaging app opens for you to send. We cannot confirm
                    delivery. Image downloads contain the card text; buttons and
                    expanded details remain interactive on the web page.
                  </p>
                </div>
              )}
            </div>
            <p
              className={`creator-status ${error ? "status-error" : ""}`}
              role="status"
              aria-live="polite"
            >
              {status}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
