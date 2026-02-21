import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "YupiFiesta",
    description: "Celebrate every moment with YupiFiesta",
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

