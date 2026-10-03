import { guidesMetadata } from '../src/lib/guidesMetadata.ts';
import { getGuideContent } from '../src/lib/guideContent.ts';
import { guideSources } from '../src/lib/guideSources.ts';
import { guideTools } from '../src/lib/guideTools.ts';

function countWords(str) {
  if (!str) return 0;
  // Clean markdown syntax markers if any, count substantive words
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function auditAllGuides() {
  const results = [];
  let underCount = 0;

  for (const guide of guidesMetadata) {
    const slug = guide.slug;
    const content = getGuideContent(slug);
    if (!content) {
      results.push({ slug, error: 'Missing content' });
      underCount++;
      continue;
    }

    const introWords = countWords(content.intro);
    const summaryWords = countWords(content.summary);
    let sectionWords = 0;
    for (const s of content.sections) {
      sectionWords += countWords(s.title) + countWords(s.content);
    }
    let faqWords = 0;
    for (const f of content.faqs) {
      faqWords += countWords(f.question) + countWords(f.answer);
    }

    const mainBodyWords = introWords + sectionWords + summaryWords;
    const totalVisibleWords = mainBodyWords + faqWords;
    const sources = guideSources[slug] || [];
    const tools = guideTools[slug] || [];

    const meetsMin = totalVisibleWords >= 2500;
    if (!meetsMin) underCount++;

    results.push({
      slug,
      title: guide.title,
      category: guide.category,
      introWords,
      sectionWords,
      summaryWords,
      mainBodyWords,
      faqWords,
      totalVisibleWords,
      sectionsCount: content.sections.length,
      faqsCount: content.faqs.length,
      sourcesCount: sources.length,
      toolsCount: tools.length,
      meetsMin
    });
  }

  return { results, underCount, total: guidesMetadata.length };
}

if (process.argv[1]?.endsWith('validate-guide-enrichment.mjs')) {
  const { results, underCount, total } = auditAllGuides();
  console.log(`\n================ GUIDE CONTENT AUDIT (${total} guides) ================`);
  console.table(
    results.map((r) => ({
      slug: r.slug,
      category: r.category,
      'Body Words': r.mainBodyWords,
      'FAQ Words': r.faqWords,
      'Total Words': r.totalVisibleWords,
      Sections: r.sectionsCount,
      FAQs: r.faqsCount,
      'Pass?': r.meetsMin ? 'PASS' : 'FAIL'
    }))
  );

  console.log(`\nResult: ${total - underCount}/${total} guides meet the 2,500 word minimum.`);
  if (underCount > 0) {
    console.log(`Still incomplete: ${underCount} guides remain under 2,500 words.\n`);
  } else {
    console.log(`ALL ${total} GUIDES EXCEED 2,500 WORDS!\n`);
  }
}
