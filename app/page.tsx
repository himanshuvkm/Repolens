import { LandingHero } from "@/components/LandingHero";
import { RepoInput } from "@/components/RepoInput";
import { BentoFeatures } from "@/components/BentoFeatures";
import { FeatureSpotlight } from "@/components/FeatureSpotlight";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <div className="relative w-full pb-24">
        <div className="pointer-events-none absolute inset-0 noise-bg opacity-50" />
        <LandingHero />
        <div className="relative z-10 mt-6 flex w-full justify-center">
          <RepoInput />
        </div>
        <BentoFeatures />
        <FeatureSpotlight />
      </div>
      <Footer />
    </>
  );
}
