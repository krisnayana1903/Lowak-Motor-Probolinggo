import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Header } from "@/components/ui/header";
import { RfqProvider } from "@/components/rfq/rfq-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lowak Motor — International Motorcycle Spare Parts Catalog",
  description:
    "Browse our extensive catalog of motorcycle spare parts. OEM and aftermarket parts for all major brands. Request a quote via WhatsApp.",
  keywords: [
    "motorcycle parts",
    "spare parts",
    "OEM",
    "aftermarket",
    "motorcycle catalog",
    "Lowak Motor",
    "Probolinggo",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-zinc-500">
                © {new Date().getFullYear()} Lowak Motor Probolinggo. All rights
                reserved.
              </p>
              <p className="text-xs text-zinc-400">
                Prices shown are reference prices only. Final pricing provided
                upon inquiry.
              </p>
            </div>
          </div>
        </footer>
        <RfqProvider />
      </body>
    </html>
  );
}
