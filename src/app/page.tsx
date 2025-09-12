import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Clock, Search, MapPin, Building2, ArrowRight } from "lucide-react";
import { TopDoctorsGrid } from "@/components/top-doctors-grid";

export default async function Home() {
  // Top doctors by number of appointments (desc)
  const topDoctors = await prisma.doctor.findMany({
    take: 6,
    include: {
      _count: { select: { appointments: true } },
      clinic: { include: { city: true } },
    },
    orderBy: {
      appointments: { _count: "desc" },
    },
  });
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/70 to-transparent dark:from-cyan-950/20 pointer-events-none" />
        {/* Decorative hero wave */}
        <svg aria-hidden className="absolute -left-20 -top-20 h-[40rem] w-[40rem] opacity-20 blur-3xl dark:opacity-25 pointer-events-none" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <path fill="url(#g1)" d="M42.5,-61.3C53.6,-55.8,60.8,-44.6,66.8,-32.5C72.8,-20.4,77.7,-7.3,78.7,6.5C79.7,20.4,76.9,34.9,68.8,46.4C60.7,57.9,47.3,66.3,33.2,71.2C19.1,76.1,4.3,77.5,-9.6,74.7C-23.5,71.8,-36.5,64.6,-48.1,55C-59.7,45.4,-69.8,33.4,-73.9,19.6C-77.9,5.8,-75.9,-9.7,-69.4,-23.3C-63,-36.8,-52,-48.4,-39.7,-54.6C-27.4,-60.9,-13.7,-61.9,-0.6,-60.9C12.5,-59.9,25,-56.9,42.5,-61.3Z" transform="translate(100 100)" />
        </svg>
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
          <div className="mx-auto max-w-2xl md:max-w-3xl lg:max-w-4xl text-center md:text-left">
            <p className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">سریع، امن و سئو‑دوست</p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">رزرو نوبت پزشکی با پزشکان معتبر در سراسر ایران</h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl md:max-w-3xl">پزشک خود را بر اساس شهر و کلینیک پیدا کنید، ظرفیت‌ لحظه‌ای را ببینید و در چند ثانیه نوبت بگیرید — بدون نیاز به حساب کاربری. به‌زودی پرداخت آنلاین با زرین‌پال.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="#top-doctors" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-primary-foreground font-medium shadow hover:bg-primary/90 w-full sm:w-auto">مشاهده پزشکان برتر</Link>
              <Link href="/doctors" className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 font-medium hover:bg-accent w-full sm:w-auto">همه پزشکان</Link>
            </div>

            {/* Quick search panel */}
            <div className="mt-6 rounded-2xl border bg-card p-4 sm:p-5 shadow-sm">
              <form action="/doctors" method="get" className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    name="city"
                    placeholder="شهر (مثال: تهران)"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    name="q"
                    placeholder="نام پزشک یا تخصص (مثال: قلب و عروق)"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-primary-foreground font-medium hover:bg-primary/90"
                >
                  جستجو
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Platform highlights */}
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-sky-500/30">
            <div className="rounded-2xl border p-5 hover:shadow-sm transition-shadow bg-card">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">بدون نیاز به حساب کاربری</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">فقط نام و شماره تماس را وارد کنید و فوری نوبت بگیرید.</p>
            </div>
          </div>
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-sky-500/30">
            <div className="rounded-2xl border p-5 hover:shadow-sm transition-shadow bg-card">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">ظرفیت لحظه‌ای</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">زمان‌های خالی بلافاصله رزرو می‌شوند تا دو بار رزرو نشود.</p>
            </div>
          </div>
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 to-sky-500/30">
            <div className="rounded-2xl border p-5 hover:shadow-sm transition-shadow bg-card">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">صفحات بهینه برای سئو</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">هر پزشک صفحه اختصاصی برای دیده‌شدن در موتورهای جستجو دارد.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top doctors */}
      <section id="top-doctors" className="container mx-auto px-4 pb-14">
        <div className="mx-auto max-w-7xl flex items-end justify-between mb-6 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">پزشکان پربازدید و پُر نوبت</h2>
            <p className="text-muted-foreground mt-1">بر اساس تعداد نوبت‌های اخیر.</p>
          </div>
          <Link href="/doctors" className="hidden sm:inline-flex rounded-md border px-3 py-1.5 text-sm hover:bg-accent">مشاهده همه</Link>
        </div>

        {topDoctors.length === 0 ? (
          <p className="text-muted-foreground">هنوز پزشکی ثبت نشده است.</p>
        ) : (
          <TopDoctorsGrid doctors={topDoctors as any} cities={cities as any} />
        )}
      </section>
    </div>
  );
}
