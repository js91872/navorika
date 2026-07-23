import Hero from "@/components/home/Hero";
import { PremiumToolGrid } from "@/components/ui/PremiumToolGrid";
import { TrustSignals } from "@/components/ui/TrustSignals";
import { getAllTools } from "@/lib/toolRegistry";

export default function HomePage() {
  const allTools = getAllTools();
  
  // Get featured tools
  const featuredTools = allTools.filter(t => t.featured).slice(0, 6);
  
  // Get popular tools
  const popularTools = allTools.filter(t => t.popular).slice(0, 6);
  
  // Get all tools for the grid
  const displayTools = allTools.slice(0, 9);

  return (
    <>
      <Hero />
      
      {/* Trust Signals */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustSignals />
        </div>
      </section>
      
      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PremiumToolGrid 
              tools={featuredTools} 
              title="Featured Tools" 
              subtitle="Most popular and highly-rated tools on Navorika."
              columns={3}
              variant="default"
            />
          </div>
        </section>
      )}
      
      {/* Popular Tools */}
      {popularTools.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PremiumToolGrid 
              tools={popularTools} 
              title="Popular Tools" 
              subtitle="Most used tools by our community."
              columns={3}
              variant="default"
            />
          </div>
        </section>
      )}
      
      {/* All Tools */}
      <section className="py-16 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/50 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PremiumToolGrid 
            tools={displayTools} 
            title="All Tools" 
            subtitle="Explore our complete collection of free online tools."
            columns={3}
            variant="default"
          />
        </div>
      </section>
    </>
  );
}
