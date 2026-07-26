import PremiumHero from "@/components/home/PremiumHero";
import PremiumCategories from "@/components/home/PremiumCategories";
import PremiumFeatures from "@/components/home/PremiumFeatures";
import PremiumStats from "@/components/home/PremiumStats";
import PremiumTools from "@/components/home/PremiumTools";
import PremiumCTA from "@/components/home/PremiumCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <PremiumHero />
      <PremiumStats />
      <PremiumCategories />
      <PremiumTools />
      <PremiumFeatures />
      <PremiumCTA />
    </main>
  );
}
