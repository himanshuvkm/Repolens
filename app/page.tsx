import { LandingHero } from "@/components/LandingHero";
import { RepoInput } from "@/components/RepoInput";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
      <LandingHero />
      <div className="w-full mt-4 flex justify-center">
        <RepoInput />
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
    </div>
  );
}
