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
      <body className={`${inter.className} bg-gray-950 text-slate-50 min-h-screen selection:bg-blue-500/30 selection:text-blue-200`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-white hover:text-blue-400 transition-colors">
                <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-blue-500/20">
                  R
                </span>
                RepoLens
              </a>
              <a href="https://github.com/yourusername/repolens" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                Star on GitHub
              </a>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-gray-800 py-8 px-4 mt-auto">
            <div className="container mx-auto text-center text-gray-500 text-sm">
              <p>Built with Next.js, Tailwind CSS, and Gemini 2.0 API.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
