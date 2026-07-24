import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { PopularTools } from "@/components/home/PopularTools";
import { WhyNavorika } from "@/components/home/WhyNavorika";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedTools />
      <PopularTools />
      <WhyNavorika />
    </>
  );
}
