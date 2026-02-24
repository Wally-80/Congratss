import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Congratss",
    description: "Celebrate every moment with Congratss",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Congratss",
    },
    icons: {
        apple: "/logo.png",
    },
};

export const viewport: Viewport = {
    themeColor: "#030308",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

import { AuthProvider } from "@/context/AuthContext";
import Fireworks from "@/components/Fireworks";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased" suppressHydrationWarning>
                <Fireworks />
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}

