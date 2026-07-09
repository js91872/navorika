import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedTools from "@/components/home/FeaturedTools";
import WhyNavorika from "@/components/home/WhyNavorika";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <FeaturedTools />
      <WhyNavorika />
    </>
  );
}