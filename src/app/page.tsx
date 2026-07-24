import { Hero } from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { PopularTools } from "@/components/home/PopularTools";
import { WhyNavorika } from "@/components/home/WhyNavorika";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedTools />
      <PopularTools />
      <WhyNavorika />
    </>
  );
}
