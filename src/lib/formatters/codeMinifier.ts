import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';
import * as parserPostcss from 'prettier/plugins/postcss';
import * as parserHtml from 'prettier/plugins/html';
import { minify as terserMinify } from 'terser';

// Direct CleanCSS engine submodules (browser-safe, zero Node.js fs dependencies)
// @ts-expect-error clean-css internal module without dedicated declaration
import tokenize from 'clean-css/lib/tokenizer/tokenize';
// @ts-expect-error clean-css internal module without dedicated declaration
import level0Optimize from 'clean-css/lib/optimizer/level-0/optimize';
// @ts-expect-error clean-css internal module without dedicated declaration
import level1Optimize from 'clean-css/lib/optimizer/level-1/optimize';
// @ts-expect-error clean-css internal module without dedicated declaration
import serializeStyles from 'clean-css/lib/writer/simple';
// @ts-expect-error clean-css internal module without dedicated declaration
import validator from 'clean-css/lib/optimizer/validator';
// @ts-expect-error clean-css internal module without dedicated declaration
import compatibilityFrom from 'clean-css/lib/options/compatibility';
// @ts-expect-error clean-css internal module without dedicated declaration
import { optimizationLevelFrom } from 'clean-css/lib/options/optimization-level';
// @ts-expect-error clean-css internal module without dedicated declaration
import inputSourceMapTracker from 'clean-css/lib/reader/input-source-map-tracker';
// @ts-expect-error clean-css internal module without dedicated declaration
import pluginsFrom from 'clean-css/lib/options/plugins';

export type CodeLanguage = 'javascript' | 'css' | 'html';
export type BeautifyIndent = 2 | 4;

export interface CodeProcessResult {
  success: boolean;
  output: string;
  error?: string;
}

export async function beautifyCode(
  code: string,
  language: CodeLanguage,
  tabWidth: BeautifyIndent = 2
): Promise<CodeProcessResult> {
  if (!code.trim()) {
    return { success: true, output: '' };
  }

  try {
    let formatted = '';
    if (language === 'javascript') {
      formatted = await prettier.format(code, {
        parser: 'babel',
        plugins: [parserBabel, parserEstree],
        tabWidth,
        semi: true,
        singleQuote: true,
      });
    } else if (language === 'css') {
      formatted = await prettier.format(code, {
        parser: 'css',
        plugins: [parserPostcss],
        tabWidth,
      });
    } else if (language === 'html') {
      formatted = await prettier.format(code, {
        parser: 'html',
        plugins: [parserHtml],
        tabWidth,
      });
    }

    return { success: true, output: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: code, error: errorMsg };
  }
}

export async function minifyCode(
  code: string,
  language: CodeLanguage
): Promise<CodeProcessResult> {
  if (!code.trim()) {
    return { success: true, output: '' };
  }

  try {
    let minified = '';
    if (language === 'javascript') {
      const result = await terserMinify(code, {
        compress: {
          dead_code: true,
          drop_console: false,
          drop_debugger: true,
        },
        mangle: true,
        format: {
          comments: false,
        },
      });

      if (result.code === undefined) {
        throw new Error('Terser minification produced no output.');
      }
      minified = result.code;
    } else if (language === 'css') {
      const compatibility = compatibilityFrom();
      const context = {
        cache: { specificity: {} },
        errors: [] as string[],
        inputSourceMapTracker: inputSourceMapTracker(),
        options: {
          compatibility,
          format: false,
          level: optimizationLevelFrom(1),
          plugins: pluginsFrom(),
        },
        validator: validator(compatibility),
        warnings: [] as string[],
      };

      const tokens = tokenize(code, context);
      const l0 = level0Optimize(tokens, context);
      const l1 = level1Optimize(l0, context);
      const serialized = serializeStyles(l1, context);

      if (context.errors && context.errors.length > 0) {
        throw new Error(context.errors.join('; '));
      }
      minified = serialized.styles;
    } else if (language === 'html') {
      // Lazy load html-minifier-terser standalone bundle on client-side
      const htmlMinifierModule = await import(
        // @ts-expect-error browser standalone bundle
        'html-minifier-terser/dist/htmlminifier.esm.bundle'
      );
      const htmlMinifier = htmlMinifierModule.minify || htmlMinifierModule.default?.minify;
      if (typeof htmlMinifier !== 'function') {
        throw new Error('HTML minifier engine failed to initialize.');
      }
      minified = await htmlMinifier(code, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: false,
        minifyJS: false,
      });
    }

    return { success: true, output: minified };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: code, error: errorMsg };
  }
}

export const CODE_SAMPLES: Record<CodeLanguage, string> = {
  javascript: `// Sample JavaScript
function calculateDiscount(price, discountPercent) {
  if (price <= 0 || discountPercent < 0) {
    throw new Error("Invalid parameters");
  }
  const discountAmount = (price * discountPercent) / 100;
  const finalPrice = price - discountAmount;
  return {
    originalPrice: price,
    discountAmount: Number(discountAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2))
  };
}

console.log(calculateDiscount(149.99, 15));`,

  css: `/* Sample CSS */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.header-container .nav-link {
  color: #475569;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease-in-out;
}

.header-container .nav-link:hover {
  color: #2563eb;
}`,

  html: `<!-- Sample HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navorika Developer Tools</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; padding: 2rem; }
    h1 { color: #1e293b; }
  </style>
</head>
<body>
  <header>
    <h1>Code Beautifier & Minifier</h1>
    <p>Clean and compress code locally in your browser.</p>
  </header>
  <main>
    <section class="card">
      <h2>Fast, Private, Native</h2>
      <p>Your source code never leaves your device.</p>
    </section>
  </main>
</body>
</html>`
};
