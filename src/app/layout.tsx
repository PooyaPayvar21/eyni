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
          <header className="sticky top-0 z-50 border-b backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 dark:bg-amber-200">
            <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* logo */}
                <span className="flex font-semibold text-lg dark:text-blue-50">سایت نوبت دهی</span>
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 ">
                  <Link href="/" className="text-sm text-slate-200 dark:text-slate-300 hover:bg-white/50 hover:text-white dark:hover:bg-[#013C53] px-3 py-2 rounded-md transition">
                    خانه
                  </Link>
                  <Link href="/request" className="text-sm text-slate-200 dark:text-slate-300 hover:bg-white/50 hover:text-white dark:hover:bg-[#013C53] px-3 py-2 rounded-md transition">
                    درخواست نوبت
                  </Link>
                  <Link href="/doctors" className="text-sm text-slate-200 dark:text-slate-300 hover:bg-white/50 hover:text-white dark:hover:bg-[#013C53] px-3 py-2 rounded-md transition">
                    همه پزشکان
                  </Link>
                  <Link href="/contact" className="text-sm text-slate-200 dark:text-slate-300 hover:bg-white/50 hover:text-white dark:hover:bg-[#013C53] px-3 py-2 rounded-md transition">
                    ارتباط با ما                </Link>
                </nav>
                {/* actions */}
                <div className="flex items-center gap-3">
                  <Link href="/" className="hidden md:inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-1.5 rounded-md transition">
                    ورود/ثبت نام
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
