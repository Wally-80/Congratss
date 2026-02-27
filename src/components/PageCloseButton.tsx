"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface PageCloseButtonProps {
    className?: string;
    href?: string;
}

export default function PageCloseButton({ className = "", href = "/" }: PageCloseButtonProps) {
    return (
        <Link
            href={href}
            aria-label="Close page"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-[var(--pane-bg)]/85 text-[var(--app-text-dim)] backdrop-blur-md transition-colors hover:text-[var(--app-text)] hover:bg-black/5 dark:hover:bg-white/10 ${className}`}
        >
            <X className="h-5 w-5" />
        </Link>
    );
}
