import Breadcrumb from "./Breadcrumb";
import ToolHero from "./ToolHero";
import ToolContent from "./ToolContent";
import ToolFormula from "./ToolFormula";
import ToolExamples from "./ToolExamples";
import ToolFAQ from "./ToolFAQ";
import RelatedTools from "./RelatedTools";
import RelatedArticles from "./RelatedArticles";

import { ToolData } from "@/types/tool";

interface ToolLayoutProps {
  tool: ToolData;
  children: React.ReactNode;
}

export default function ToolLayout({
  tool,
  children,
}: ToolLayoutProps) {
  return (
    <>
      <Breadcrumb tool={tool} />

      <ToolHero tool={tool} />

      {children}

      <ToolContent tool={tool} />

      <ToolFormula tool={tool} />

      <ToolExamples tool={tool} />

      <ToolFAQ tool={tool} />

      <RelatedTools tool={tool} />

      <RelatedArticles tool={tool} />
    </>
  );
}