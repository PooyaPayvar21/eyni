import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "رزرو نوبت پزشک",
  description: "رزرو نوبت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center justify-between h-14 px-4">
              <Link href="/" className="font-semibold">
                Appoi
              </Link>
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
