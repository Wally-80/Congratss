"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

interface OnboardingModalProps {
    isOpen: boolean;
    onFinish: () => void | Promise<void>;
    onEnableNotifications: () => void | Promise<void>;
    onGoHome: () => void;
    onGoCalendar: () => void;
    onGoSettings: () => void;
}

export default function OnboardingModal({
    isOpen,
    onFinish,
    onEnableNotifications,
    onGoHome,
    onGoCalendar,
    onGoSettings,
}: OnboardingModalProps) {
    const { language } = useAuth();
    const t = translations[language];
    const [isSaving, setIsSaving] = useState(false);
    const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [viewport, setViewport] = useState({ width: 0, height: 0 });

    const steps = useMemo(() => ([
        {
            id: "intro",
            title: t.onboarding_tour_intro_title,
            description: t.onboarding_tour_intro_desc,
        },
        {
            id: "add",
            selector: "[data-tour='add-button']",
            title: t.onboarding_tour_add_title,
            description: t.onboarding_tour_add_desc,
            focusTab: "home" as const,
        },
        {
            id: "home",
            selector: "[data-tour='tab-home']",
            title: t.onboarding_tour_home_title,
            description: t.onboarding_tour_home_desc,
            focusTab: "home" as const,
        },
        {
            id: "calendar",
            selector: "[data-tour='tab-calendar']",
            title: t.onboarding_tour_calendar_title,
            description: t.onboarding_tour_calendar_desc,
            focusTab: "calendar" as const,
        },
        {
            id: "settings",
            selector: "[data-tour='tab-settings']",
            title: t.onboarding_tour_settings_title,
            description: t.onboarding_tour_settings_desc,
            focusTab: "settings" as const,
        },
        {
            id: "notifications",
            selector: "[data-tour='notifications-toggle']",
            title: t.onboarding_tour_notifications_title,
            description: t.onboarding_tour_notifications_desc,
            focusTab: "settings" as const,
            showNotificationsAction: true,
        },
    ]), [t]);

    const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
    const isLastStep = stepIndex === steps.length - 1;

    const handleFinish = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await onFinish();
        } finally {
            setIsSaving(false);
        }
    };

    const handleEnableNotifications = async () => {
        if (isEnablingNotifications) return;
        setIsEnablingNotifications(true);
        try {
            await onEnableNotifications();
        } finally {
            setIsEnablingNotifications(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setStepIndex(0);
        onGoHome();
    }, [isOpen, onGoHome]);

    useEffect(() => {
        if (!isOpen) return;
        if (currentStep.focusTab === "home") onGoHome();
        if (currentStep.focusTab === "calendar") onGoCalendar();
        if (currentStep.focusTab === "settings") onGoSettings();
    }, [currentStep.focusTab, isOpen, onGoCalendar, onGoHome, onGoSettings]);

    useEffect(() => {
        if (!isOpen) return;

        const updateViewport = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };
        updateViewport();

        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setTargetRect(null);
            return;
        }
        if (!currentStep.selector) {
            setTargetRect(null);
            return;
        }

        const updateTarget = () => {
            const target = document.querySelector(currentStep.selector) as HTMLElement | null;
            if (!target) {
                setTargetRect(null);
                return;
            }
            setTargetRect(target.getBoundingClientRect());
        };

        updateTarget();
        const intervalId = window.setInterval(updateTarget, 250);
        window.addEventListener("resize", updateTarget);
        window.addEventListener("scroll", updateTarget, true);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("resize", updateTarget);
            window.removeEventListener("scroll", updateTarget, true);
        };
    }, [currentStep.selector, isOpen]);

    const focusRect = useMemo(() => {
        if (!targetRect) return null;
        const padding = 8;
        const top = Math.max(6, targetRect.top - padding);
        const left = Math.max(6, targetRect.left - padding);
        const maxWidth = Math.max(0, viewport.width - left - 6);
        const maxHeight = Math.max(0, viewport.height - top - 6);

        return {
            top,
            left,
            width: Math.min(targetRect.width + padding * 2, maxWidth),
            height: Math.min(targetRect.height + padding * 2, maxHeight),
        };
    }, [targetRect, viewport.height, viewport.width]);

    const tooltipStyle = useMemo(() => {
        const width = Math.min(360, Math.max(280, viewport.width - 24));
        if (!targetRect) {
            return {
                width,
                left: Math.max(12, (viewport.width - width) / 2),
                top: Math.max(20, viewport.height * 0.2),
            };
        }

        const left = Math.min(
            Math.max(12, targetRect.left + targetRect.width / 2 - width / 2),
            Math.max(12, viewport.width - width - 12)
        );
        const preferTop = targetRect.top > viewport.height * 0.55;
        const top = preferTop
            ? Math.max(12, targetRect.top - 220)
            : Math.min(Math.max(12, viewport.height - 220), targetRect.bottom + 16);

        return { width, left, top };
    }, [targetRect, viewport.height, viewport.width]);

    const goNext = () => {
        if (isLastStep) {
            void handleFinish();
            return;
        }
        setStepIndex((previous) => Math.min(previous + 1, steps.length - 1));
    };

    const goBack = () => {
        setStepIndex((previous) => Math.max(0, previous - 1));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[240]">
            <div className="absolute inset-0 bg-slate-950/72 backdrop-blur-[2px]" />
            {focusRect && (
                <div
                    className="fixed rounded-2xl border border-cyan-300/90 pointer-events-none transition-all duration-300"
                    style={{
                        top: focusRect.top,
                        left: focusRect.left,
                        width: focusRect.width,
                        height: focusRect.height,
                        boxShadow: "0 0 0 9999px rgba(2,6,23,0.72), 0 0 0 2px rgba(34,211,238,0.45), 0 20px 45px rgba(0,0,0,0.45)",
                    }}
                />
            )}

            <div
                className="fixed rounded-[1.75rem] border border-cyan-300/35 bg-slate-950/92 text-white p-5 shadow-2xl animate-in fade-in zoom-in duration-300"
                style={tooltipStyle}
            >
                <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 font-black">{t.onboarding_badge}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/55">
                        {stepIndex + 1}/{steps.length}
                    </p>
                </div>

                <h3 className="mt-2 text-lg font-black text-white">{currentStep.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{currentStep.description}</p>

                <div className="mt-4 flex gap-2">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === stepIndex ? "w-6 bg-cyan-300" : "w-2 bg-white/25"}`}
                        />
                    ))}
                </div>

                {currentStep.showNotificationsAction && (
                    <button
                        type="button"
                        onClick={handleEnableNotifications}
                        disabled={isEnablingNotifications}
                        className="mt-4 w-full rounded-xl border border-cyan-300/40 bg-cyan-400/10 py-2.5 text-xs font-black uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/15 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Bell className="w-4 h-4" />
                        {isEnablingNotifications ? t.processing : t.onboarding_tour_enable_notifications}
                    </button>
                )}

                <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={handleFinish}
                        disabled={isSaving}
                        className="text-[11px] uppercase tracking-widest text-white/65 hover:text-white disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {t.onboarding_tour_skip}
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={goBack}
                            disabled={stepIndex === 0}
                            className="h-10 w-10 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/35 disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center"
                            aria-label={t.onboarding_tour_back}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={isSaving}
                            className="rounded-xl bg-cyan-300 text-slate-950 px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLastStep ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            {isLastStep ? (isSaving ? t.processing : t.onboarding_tour_done) : t.onboarding_tour_next}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
