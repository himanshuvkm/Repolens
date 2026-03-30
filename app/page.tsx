import { LandingHero } from "@/components/LandingHero";
import { RepoInput } from "@/components/RepoInput";
import { BentoFeatures } from "@/components/BentoFeatures";
import { FeatureSpotlight } from "@/components/FeatureSpotlight";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/5 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 noise-bg"></div>
      </div>
      
      <div className="relative z-10 w-full pb-20">
        <LandingHero />
        <div className="w-full flex justify-center relative mt-4">
          <RepoInput />
        </div>
        <BentoFeatures />
        <FeatureSpotlight />
      </div>
        <Footer />
    </>
  );
}
