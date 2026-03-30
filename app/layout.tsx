import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RepoLens | AI-Powered GitHub Analyzer',
  description: 'Instant intelligence on any GitHub repository using Gemini 2.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${inter.className} text-on-surface bg-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen flex flex-col`}>
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-outline-variant/5">
          <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
            <div className="flex items-center gap-8">
              <a href="/" className="text-xl font-black tracking-tighter text-white bg-gradient-to-r from-primary-container to-primary bg-clip-text text-transparent">
                RepoLens
              </a>
              <div className="hidden md:flex gap-6 tracking-tight font-medium text-sm">
                <a className="text-on-surface-variant hover:text-white transition-colors" href="#">Docs</a>
                <a className="text-on-surface-variant hover:text-white transition-colors" href="#">Pricing</a>
                <a className="text-on-surface-variant hover:text-white transition-colors" href="#">Blog</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="#analyzer" className="bg-primary-container hover:bg-[#508ff8] text-on-primary-container px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 inline-block text-center">
                Analyze Repo
              </a>
            </div>
          </div>
        </nav>
        
        <main className="flex-grow pt-24 mb-0">
          {children}
        </main>   
      </body>
    </html>
  );
}
