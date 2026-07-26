import PremiumHero from "@/components/home/PremiumHero";
import PremiumStats from "@/components/home/PremiumStats";
import PremiumCategories from "@/components/home/PremiumCategories";
import PremiumTools from "@/components/home/PremiumTools";
import PremiumFeatures from "@/components/home/PremiumFeatures";
import PremiumCTA from "@/components/home/PremiumCTA";

export default function HomePage() {
  return (
    <main>
      <PremiumHero />
      <PremiumStats />
      <PremiumCategories />
      <PremiumTools />
      <PremiumFeatures />
      <PremiumCTA />
    </main>
  );
}
