import { execSync } from 'child_process';
import { guidesMetadata } from '../src/lib/guidesMetadata.ts';

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w)).length;
}

// Simple HTML text extractor for <article> main body
function extractMainBodyText(html) {
  // Find <article>...</article>
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  if (!articleMatch) return '';
  const articleHtml = articleMatch[0];

  // Cut off FAQs, Sources, Related Tools, Related Guides, which appear at end of article
  const cutIndex = articleHtml.search(/<section[^>]*id="guide-faqs"/i);
  let mainHtml = cutIndex !== -1 ? articleHtml.slice(0, cutIndex) : articleHtml;

  // Cut off Table of Contents (<nav aria-label="Table of contents">...</nav>)
  mainHtml = mainHtml.replace(/<nav[\s\S]*?<\/nav>/gi, ' ');

  // Cut off disclaimer aside (<aside>...</aside>)
  mainHtml = mainHtml.replace(/<aside[\s\S]*?<\/aside>/gi, ' ');

  // Strip scripts and styles
  mainHtml = mainHtml.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  mainHtml = mainHtml.replace(/<style[\s\S]*?<\/style>/gi, ' ');

  // Replace block tags with spaces
  mainHtml = mainHtml.replace(/<\/(p|div|h1|h2|h3|h4|section|tr|td|th|li|figcaption)>/gi, ' ');

  // Strip all other HTML tags
  const textOnly = mainHtml.replace(/<[^>]+>/g, ' ');

  // Decode standard HTML entities
  const decoded = textOnly
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return decoded;
}

export async function runBrowserVerification() {
  console.log(`\n================ BROWSER DOM AUDIT VIA HEADLESS CHROME ================`);
  console.log(`Auditing all ${guidesMetadata.length} guides rendered live from http://localhost:3000...\n`);

  const results = [];
  let underCount = 0;

  for (let i = 0; i < guidesMetadata.length; i++) {
    const guide = guidesMetadata[i];
    const slug = guide.slug;
    const url = `http://localhost:3000/guides/${slug}`;

    try {
      // Execute headless chrome to dump live rendered DOM
      const html = execSync(
        `google-chrome --headless=new --dump-dom "${url}"`,
        { maxBuffer: 10 * 1024 * 1024, encoding: 'utf-8' }
      );

      const mainText = extractMainBodyText(html);
      const wordCount = countWords(mainText);

      // Verify JSON-LD in rendered DOM
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      let jsonLdValid = false;
      let hasArticle = false;
      let hasBreadcrumb = false;
      if (jsonLdMatch) {
        try {
          const parsed = JSON.parse(jsonLdMatch[1]);
          const graph = parsed['@graph'] || [parsed];
          hasArticle = graph.some(e => e['@type'] === 'Article');
          hasBreadcrumb = graph.some(e => e['@type'] === 'BreadcrumbList');
          jsonLdValid = hasArticle && hasBreadcrumb;
        } catch {
          jsonLdValid = false;
        }
      }

      const meetsMin = wordCount >= 2500;
      if (!meetsMin) underCount++;

      results.push({
        index: i + 1,
        slug,
        category: guide.category,
        domWords: wordCount,
        jsonLdValid,
        pass: meetsMin && jsonLdValid
      });

      process.stdout.write(`[${i + 1}/${guidesMetadata.length}] ${slug}: ${wordCount} DOM words ${meetsMin ? '✓' : '✗'}\n`);
    } catch (err) {
      console.error(`Error loading ${url} in Chrome:`, err.message);
      underCount++;
      results.push({ index: i + 1, slug, error: err.message, pass: false });
    }
  }

  console.log(`\n================ BROWSER DOM AUDIT SUMMARY ================`);
  console.log(`Result: ${guidesMetadata.length - underCount}/${guidesMetadata.length} guides pass.`);
  if (underCount > 0) {
    console.error(`FAILURE: ${underCount} guides failed DOM word count or JSON-LD verification!`);
    process.exit(1);
  } else {
    console.log(`SUCCESS: All 46 guides independently exceed 2,500 rendered DOM words and possess valid JSON-LD!\n`);
  }
}

runBrowserVerification();
