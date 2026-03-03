import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export type ScheduledChannel = "whatsapp" | "email" | "sms";
export type ScheduledMessageStatus = "scheduled" | "sent" | "failed" | "cancelled";

export interface ScheduledMessage {
    id: string;
    userId: string;
    celebrationTitle: string;
    channel: ScheduledChannel;
    recipient: string;
    message: string;
    shareUrl: string;
    cardLabel: string;
    cardUrl: string;
    scheduledAt: Date;
    status: ScheduledMessageStatus;
    createdAt?: Date;
    updatedAt?: Date;
    sentAt?: Date;
    lastError?: string;
}

type ScheduleMessageInput = {
    celebrationTitle: string;
    channel: ScheduledChannel;
    recipient: string;
    message: string;
    shareUrl: string;
    cardLabel: string;
    cardUrl: string;
    scheduledAt: Date;
};

const COLLECTION_NAME = "scheduled_messages";

const toDate = (value: unknown): Date | undefined => {
    if (value instanceof Timestamp) return value.toDate();
    if (value && typeof (value as { toDate?: unknown }).toDate === "function") {
        return ((value as { toDate: () => Date }).toDate());
    }
    return undefined;
};

export const useScheduledMessages = () => {
    const { user } = useAuth();
    const userId = user?.uid;
    const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((item) => {
                const raw = item.data();
                return {
                    id: item.id,
                    userId: raw.userId as string,
                    celebrationTitle: raw.celebrationTitle as string,
                    channel: raw.channel as ScheduledChannel,
                    recipient: (raw.recipient as string) ?? "",
                    message: (raw.message as string) ?? "",
                    shareUrl: (raw.shareUrl as string) ?? "",
                    cardLabel: (raw.cardLabel as string) ?? "",
                    cardUrl: (raw.cardUrl as string) ?? "",
                    scheduledAt: toDate(raw.scheduledAt) ?? new Date(),
                    status: (raw.status as ScheduledMessageStatus) ?? "scheduled",
                    createdAt: toDate(raw.createdAt),
                    updatedAt: toDate(raw.updatedAt),
                    sentAt: toDate(raw.sentAt),
                    lastError: raw.lastError as string | undefined,
                } as ScheduledMessage;
            }).sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

            setScheduledMessages(data);
            setLoading(false);
            setError(null);
        }, (snapshotError) => {
            console.error("Scheduled messages snapshot error:", snapshotError);
            setError(snapshotError instanceof Error ? snapshotError.message : "Scheduling error");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const createScheduledMessage = async (input: ScheduleMessageInput) => {
        if (!userId) throw new Error("Missing user.");
        await addDoc(collection(db, COLLECTION_NAME), {
            userId,
            celebrationTitle: input.celebrationTitle,
            channel: input.channel,
            recipient: input.recipient,
            message: input.message,
            shareUrl: input.shareUrl,
            cardLabel: input.cardLabel,
            cardUrl: input.cardUrl,
            scheduledAt: Timestamp.fromDate(input.scheduledAt),
            status: "scheduled",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    };

    const updateScheduledMessageStatus = async (
        id: string,
        status: ScheduledMessageStatus,
        lastError?: string
    ) => {
        const payload: Record<string, unknown> = {
            status,
            updatedAt: serverTimestamp(),
        };
        if (status === "sent") {
            payload.sentAt = serverTimestamp();
            payload.lastError = "";
        } else if (status === "failed" && lastError) {
            payload.lastError = lastError;
        }
        await updateDoc(doc(db, COLLECTION_NAME, id), payload);
    };

    const cancelScheduledMessage = async (id: string) => {
        await updateScheduledMessageStatus(id, "cancelled");
    };

    const deleteScheduledMessage = async (id: string) => {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    };

    return {
        scheduledMessages: userId ? scheduledMessages : [],
        loading: userId ? loading : false,
        error: userId ? error : null,
        createScheduledMessage,
        updateScheduledMessageStatus,
        cancelScheduledMessage,
        deleteScheduledMessage,
    };
};
