import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import GuestProvider from "./components/GuestProvider";
import GuestBanner from "./components/GuestBanner";
import I18nProvider from "./components/I18nProvider";
import ToastProvider from "./components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "OwnCardly — Digital Business Cards You Actually Own",
    description: "Design, manage, and generate professional digital business cards for your team. Drag-and-drop designer, 11 templates, QR codes, vCard downloads. Free and open source.",
    metadataBase: new URL("https://owncardly.com"),
    openGraph: {
        title: "OwnCardly — Digital Business Cards You Actually Own",
        description: "Design professional digital business cards with a drag-and-drop designer. Free and open source.",
        url: "https://owncardly.com",
        siteName: "OwnCardly",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "OwnCardly — Digital Business Cards You Actually Own",
        description: "Design professional digital business cards with a drag-and-drop designer. Free and open source.",
    },
    keywords: ["business card", "digital card", "card generator", "vcard", "qr code", "open source", "nextjs", "self-hosted"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
            </head>
            <body className="flex min-h-full flex-col" style={{ fontFamily: "'Manrope', var(--font-geist-sans), system-ui, sans-serif" }}>
                <Analytics />
                <I18nProvider>
                    <ToastProvider>
                        <GuestProvider>
                            <Navbar />
                            <GuestBanner />
                            <main className="flex flex-1 flex-col">{children}</main>
                        </GuestProvider>
                    </ToastProvider>
                </I18nProvider>
            </body>
        </html>
    );
}
