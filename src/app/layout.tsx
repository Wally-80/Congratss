import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Congratss.com",
    description: "Celebrate every moment with Congratss.com",
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

