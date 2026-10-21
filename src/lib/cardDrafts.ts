import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { cardSchema, type CardContent } from "./cards";
export type Draft = { id: string; content: CardContent; updatedAt: string };
const key = (uid?: string) => `congratss.card-drafts.v1.${uid || "guest"}`;
export function localDrafts(uid?: string): Draft[] {
  try {
    const values: unknown = JSON.parse(localStorage.getItem(key(uid)) || "[]");
    if (!Array.isArray(values)) return [];
    return values.filter(
      (d): d is Draft =>
        typeof d?.id === "string" &&
        typeof d?.updatedAt === "string" &&
        cardSchema.safeParse(d.content).success,
    );
  } catch {
    return [];
  }
}
export function saveLocalDraft(draft: Draft, uid?: string) {
  localStorage.setItem(
    key(uid),
    JSON.stringify(
      [draft, ...localDrafts(uid).filter((d) => d.id !== draft.id)].slice(
        0,
        20,
      ),
    ),
  );
}
export async function saveAccountDraft(draft: Draft, uid: string) {
  await setDoc(doc(db, "card_drafts", draft.id), {
    schemaVersion: 1,
    userId: uid,
    content: cardSchema.parse(draft.content),
    updatedAt: serverTimestamp(),
  });
}
export async function accountDrafts(uid: string): Promise<Draft[]> {
  const snapshot = await getDocs(
    query(collection(db, "card_drafts"), where("userId", "==", uid), limit(20)),
  );
  return snapshot.docs
    .flatMap((d) => {
      const data = d.data();
      const parsed = cardSchema.safeParse(data.content);
      return parsed.success
        ? [
            {
              id: d.id,
              content: parsed.data,
              updatedAt: data.updatedAt?.toDate?.().toISOString() ?? "",
            },
          ]
        : [];
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
