import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import logo from "@/public/image.png";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "RepoLens | Contributor Intelligence for GitHub",
  description: "Editorial-grade intelligence on any GitHub repository.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", spaceGrotesk.variable, fraunces.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-canvas text-ink selection:bg-accent selection:text-accent-foreground">
        <div className="site-shell min-h-screen flex flex-col">
          <nav className="sticky top-0 z-50 border-b border-frame bg-paper/90 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 md:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-frame bg-panel shadow-[0_14px_30px_rgba(28,31,26,0.08)]">
                  <Image src={logo} alt="RepoLens Logo" width={28} height={28} className="rounded-lg object-contain" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-2xl leading-none tracking-tight text-ink">RepoLens</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                    Contributor Intelligence
                  </span>
                </span>
              </Link>

              <Link
                href="/#analyzer"
                className="rounded-full border border-frame bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition hover:-translate-y-0.5 hover:bg-white"
              >
                Start Analysis
              </Link>
            </div>
          </nav>

          <main className="flex-grow">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(28,169,201,0.16),_transparent_28%),radial-gradient(circle_at_80%_18%,_rgba(221,131,48,0.16),_transparent_24%),linear-gradient(180deg,_#f5f1e8_0%,_#efe6d8_48%,_#ede5d8_100%)]" />
              <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(42,47,37,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(42,47,37,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
