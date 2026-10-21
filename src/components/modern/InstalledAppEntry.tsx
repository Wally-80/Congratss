"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
/** Preserve the dashboard entry for installed customers while web visitors see the homepage. */
export default function InstalledAppEntry() {
  const router = useRouter();
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone;
    if (Capacitor.isNativePlatform() || standalone)
      router.replace("/dashboard");
  }, [router]);
  return null;
}
