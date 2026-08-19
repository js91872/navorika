import type { GuideContent, GuideFAQ, GuideSection } from './guideContent';

function article(
  headline: string,
  description: string,
  intro: string,
  sections: GuideSection[],
  faqs: GuideFAQ[],
  summary: string,
): GuideContent {
  return {
    intro,
    sections,
    faqs,
    summary,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      author: { '@type': 'Organization', name: 'Navorika' },
      datePublished: '2026-08-01',
      dateModified: '2026-08-19',
    },
  };
}

export const additionalGuideContent: Record<string, GuideContent> = {
  'bmr-tdee-guide': article(
    'BMR and TDEE Guide',
    'Understand basal metabolic rate, total daily energy expenditure, activity multipliers, and calorie planning.',
    'BMR estimates the energy your body uses for essential functions at rest. TDEE expands that estimate to include movement, exercise, and digestion. Both figures are useful starting points, but neither is a laboratory measurement or a guarantee of how an individual body will respond.',
    [
      { title: 'BMR, RMR, and TDEE are different estimates', content: 'Basal metabolic rate is measured under tightly controlled conditions after rest and fasting. Resting metabolic rate is measured under less restrictive conditions and is often slightly higher. Online calculators estimate one of these values from age, sex, height, and weight.\n\nTDEE adds an activity allowance to estimated resting expenditure. It is best treated as a planning range rather than an exact daily calorie budget.' },
      { title: 'How activity multipliers work', content: 'A calculator commonly multiplies BMR by an activity factor, from sedentary through very active. The difficult part is choosing the factor honestly: a desk job with three short workouts may still fall near the light-activity range because most weekly hours are sedentary.\n\nWearables can provide another estimate, but their calorie figures also contain error. Compare estimates with your weight trend over several weeks.' },
      { title: 'Using TDEE for weight goals', content: 'For weight maintenance, begin near the estimated TDEE and monitor a rolling weight average. For gradual fat loss, use a modest deficit rather than an aggressive cut. For weight gain, use a controlled surplus and review strength, measurements, and weight together.\n\nAdjust in small steps only after enough consistent data exists; day-to-day scale changes often reflect water, sodium, carbohydrate intake, and digestion.' },
      { title: 'When a calculator is not enough', content: 'Pregnancy, breastfeeding, adolescence, eating-disorder history, metabolic disease, medication changes, and high-level athletic training require individualized guidance. A registered dietitian or qualified clinician can consider medical history and nutritional adequacy that a formula cannot.' },
    ],
    [
      { question: 'Is TDEE the exact number of calories I burn?', answer: 'No. It is an estimate based on population formulas and an assumed activity level. Your multi-week trend is more informative than a single calculated number.' },
      { question: 'Why do two TDEE calculators disagree?', answer: 'They may use different BMR equations, activity factors, rounding, or body-fat inputs. Treat the results as a reasonable range.' },
      { question: 'How often should I recalculate TDEE?', answer: 'Recalculate after a meaningful weight or activity change, then validate the new estimate against several weeks of consistent observations.' },
      { question: 'Should exercise calories be added again?', answer: 'Usually not when an activity multiplier already includes exercise. Adding them again can double-count activity.' },
    ],
    'Use BMR and TDEE as transparent starting estimates, choose activity assumptions conservatively, and refine the plan from consistent real-world trends.',
  ),
  'pdf-security-guide': article(
    'PDF Security Guide',
    'Learn what PDF encryption, permissions, redaction, signatures, and safe sharing actually protect.',
    'PDF security is not a single switch. Password encryption, access permissions, redaction, digital signatures, and safe delivery solve different problems. A secure workflow starts by identifying who should read the document, what information must be removed, and how recipients will verify authenticity.',
    [
      { title: 'Encryption and permissions are not the same', content: 'An open password encrypts a PDF so a reader must provide a secret before viewing it. An owner password may set restrictions such as printing or editing, but software support varies and permissions alone should not be treated as strong confidentiality.\n\nUse modern encryption from a maintained PDF application, choose a unique passphrase, and share the password through a different channel from the file.' },
      { title: 'Redaction must remove underlying information', content: 'Drawing a black rectangle over text is not redaction; the hidden text may remain selectable, searchable, or recoverable. Proper redaction removes the underlying objects and should also address comments, attachments, form values, layers, and metadata.\n\nAfter redacting, reopen the exported copy and test search, copy, accessibility text, and document properties.' },
      { title: 'Signatures and visible marks serve different purposes', content: 'A pasted image of a handwritten signature is a visible mark. It does not cryptographically prove who signed the document or whether the file changed later. A certificate-based digital signature can provide integrity and signer information when the recipient trusts the certificate chain.' },
      { title: 'A practical secure-sharing checklist', content: 'Work on a copy, remove unnecessary pages and metadata, perform true redaction, encrypt with supported software, and verify the final file. Send access credentials separately, limit cloud-link permissions, set expiration where appropriate, and avoid uploading confidential material to services whose processing and retention policies you have not reviewed.' },
    ],
    [
      { question: 'Does a PDF permissions password prevent copying?', answer: 'It asks compatible readers to enforce restrictions, but it is not a dependable substitute for encryption or access control.' },
      { question: 'Is covering text with a shape safe redaction?', answer: 'No. The original text or image may still exist underneath. Use a true redaction workflow and verify the exported file.' },
      { question: 'Is a drawn signature a digital signature?', answer: 'No. It is a visible annotation. A cryptographic digital signature also protects document integrity and carries certificate information.' },
      { question: 'Can browser tools safely encrypt every PDF?', answer: 'Only if the tool uses a vetted encryption implementation and clearly states compatibility. Navorika keeps encryption-related tools unavailable until that requirement is met.' },
    ],
    'Match the control to the risk: encrypt for confidentiality, redact to remove data, use certificate signatures for integrity, and verify the final document before sharing.',
  ),
  'heart-rate-zones-guide': article(
    'Heart Rate Zones Guide',
    'Understand maximum-heart-rate estimates, training zones, intensity cues, and safe interpretation.',
    'Heart-rate zones translate pulse measurements into broad training-intensity ranges. They can help organize easy, moderate, and hard sessions, but formulas for maximum heart rate are estimates and individual responses vary with fitness, heat, hydration, medication, stress, and sensor accuracy.',
    [
      { title: 'Maximum heart rate is usually estimated', content: 'The familiar 220 minus age equation is simple but can be substantially wrong for an individual. Other age-based equations may improve the population estimate without becoming a personal measurement. A supervised exercise test is more individualized, particularly when clinical safety matters.' },
      { title: 'Two common ways to calculate zones', content: 'Percentage-of-maximum zones multiply estimated maximum heart rate by an intensity percentage. Heart-rate-reserve zones first subtract resting heart rate, apply the intensity percentage, and add resting heart rate back. The reserve method incorporates one measure of individual fitness, but it still depends on accurate inputs.' },
      { title: 'Use heart rate with perceived effort', content: 'Easy aerobic work should generally permit comfortable conversation. Moderate work makes conversation shorter, while vigorous work feels clearly demanding. Pairing pulse data with breathing and perceived exertion helps when wrist sensors lag during intervals or read poorly in cold weather.' },
      { title: 'Safety and progression', content: 'Increase duration and intensity gradually, include recovery, and stop exercise for chest pain, faintness, unusual breathlessness, or concerning palpitations. People with cardiovascular conditions or medicines that alter heart rate should obtain individualized guidance rather than relying on standard zones.' },
    ],
    [
      { question: 'Which heart-rate-zone formula is best?', answer: 'No age-based formula is exact for everyone. Heart-rate reserve can be more individualized, while a supervised test provides stronger personal data.' },
      { question: 'Why is my wrist tracker inconsistent?', answer: 'Motion, fit, skin contact, temperature, tattoos, and rapid intensity changes can affect optical sensors. A well-fitted chest strap is often more responsive.' },
      { question: 'Should every workout stay in one zone?', answer: 'No. Training plans usually combine easier volume, selected harder work, and recovery according to the person’s goals and experience.' },
      { question: 'Do beta blockers change training zones?', answer: 'Yes, they can lower heart-rate response. Ask a clinician for an appropriate intensity method and use perceived exertion as directed.' },
    ],
    'Treat calculated zones as ranges, cross-check them with perceived effort, and prioritize gradual progression and individual medical context.',
  ),
  'ppf-vs-fd-comparison': article(
    'PPF vs FD Comparison',
    'Compare Public Provident Fund and fixed deposits across liquidity, tax, tenure, risk, and suitability.',
    'PPF and fixed deposits are both commonly used for lower-volatility savings in India, but they solve different problems. PPF is a long-horizon government-backed scheme with statutory rules, while an FD is a bank or eligible institution deposit with selectable tenure and institution-specific rates.',
    [
      { title: 'Tenure and liquidity', content: 'PPF has a 15-year maturity framework, with rule-based partial withdrawals, loans, and extensions. It is therefore better aligned with long-term goals than emergency liquidity. FDs can be opened for many different terms, but premature closure may reduce interest or attract a penalty.' },
      { title: 'Returns, tax, and reinvestment risk', content: 'PPF interest is declared periodically under government rules and receives tax treatment subject to current law. FD interest is generally taxable according to the investor’s situation, and tax deducted at source is not necessarily the final tax liability.\n\nAn FD maturing in a lower-rate environment also creates reinvestment risk. Always compare post-tax outcomes rather than headline rates alone.' },
      { title: 'Safety is structured differently', content: 'PPF is backed by the Government of India under the scheme rules. Bank deposits depend on the institution and are covered by deposit insurance only within applicable limits and conditions. Spreading large deposits and checking the institution matters.' },
      { title: 'Choosing for a real goal', content: 'Use PPF when the long lock-in, contribution rules, and tax treatment fit a retirement or distant goal. Use FDs for defined shorter horizons, cash-flow ladders, or capital stability where the maturity date matters. Many households use both rather than treating the choice as absolute.' },
    ],
    [
      { question: 'Is PPF always better than an FD?', answer: 'No. PPF can suit long-term tax-efficient saving, while an FD may better match shorter timelines and planned liquidity.' },
      { question: 'Are FD returns guaranteed?', answer: 'The contracted rate is generally fixed for the term, subject to the deposit terms and the issuer’s ability to pay. Deposit insurance has limits.' },
      { question: 'Can PPF money be withdrawn early?', answer: 'Only under the partial-withdrawal and premature-closure rules that apply at the time. It should not be treated like an instant-access account.' },
      { question: 'What should I compare besides the interest rate?', answer: 'Compare post-tax return, tenure, liquidity, penalties, insurance coverage, contribution limits, and how well maturity matches the goal.' },
    ],
    'Choose according to time horizon and liquidity first, then compare current rules, post-tax returns, and risk rather than relying on a single advertised rate.',
  ),
  'calorie-deficit-guide': article(
    'Calorie Deficit Guide',
    'Understand calorie deficits, realistic rates of change, tracking uncertainty, and safe weight-loss planning.',
    'A calorie deficit means average energy intake is below average energy expenditure over time. It is the energy condition associated with weight loss, but a sustainable plan also needs adequate protein, fibre, micronutrients, sleep, movement, and a pace appropriate for the individual.',
    [
      { title: 'Start with an estimate, then observe', content: 'A TDEE calculator provides a starting range. Food labels, portion estimates, restaurant meals, exercise trackers, and daily activity all contain error, so exact arithmetic is rarely possible. Use a consistent process and a multi-week trend instead of reacting to one day.' },
      { title: 'Prefer a moderate, sustainable deficit', content: 'Very aggressive restriction can increase hunger, fatigue, training decline, and the risk of losing lean tissue. A modest deficit is easier to sustain and adjust. The appropriate pace depends on starting size, health status, and professional advice—not a universal internet target.' },
      { title: 'Build meals that support adherence', content: 'Include protein-rich foods, high-fibre carbohydrates, vegetables or fruit, and suitable fats. Liquid calories, alcohol, grazing, and large restaurant portions are common places where estimates drift. Resistance training and routine movement can support function and lean mass.' },
      { title: 'Know when not to self-direct', content: 'Children, adolescents, pregnant or breastfeeding people, anyone with an eating-disorder history, and people managing significant medical conditions should not follow a generic deficit plan without qualified guidance. Seek care for dizziness, fainting, persistent fatigue, menstrual changes, or obsessive food behaviours.' },
    ],
    [
      { question: 'How large should a calorie deficit be?', answer: 'There is no safe universal number. Begin conservatively and seek individualized guidance when health conditions, medications, or a history of disordered eating are relevant.' },
      { question: 'Why did scale weight rise during a deficit?', answer: 'Water, sodium, carbohydrate storage, digestion, hormonal changes, and inflammation can temporarily mask fat change.' },
      { question: 'Are exercise calories accurate?', answer: 'Wearables and machines estimate them and may be substantially wrong. Avoid automatically eating back every displayed calorie.' },
      { question: 'Can I lose fat without tracking calories?', answer: 'Yes. Consistent portions, higher-satiety foods, meal structure, and progress monitoring can create a deficit without detailed logging.' },
    ],
    'Use calculated calories as an initial hypothesis, choose a moderate approach, monitor trends, and protect nutrition, strength, and wellbeing.',
  ),
  'tax-planning-guide-2026': article(
    'India Tax Planning Guide 2026',
    'A practical framework for documentation, regime comparison, cash-flow planning, and responsible tax estimates.',
    'Tax planning means arranging legitimate financial decisions with current law, documentation, cash flow, and long-term goals in view. It is different from hiding income or fabricating deductions. Because tax rules and official guidance change, confirm important decisions with current government sources or a qualified adviser.',
    [
      { title: 'Begin with complete income information', content: 'Collect salary documents, interest certificates, capital-gain records, rental information, business income, foreign assets where applicable, and eligible deduction evidence. Pre-filled data is helpful but should be reconciled against your own records.' },
      { title: 'Compare regimes using your actual facts', content: 'Do not choose a tax regime from a generic claim that one is always better. Model taxable income, deductions that remain available, surcharge or cess where applicable, rebates, and employer payroll treatment. The ability to switch may depend on income type and current rules.' },
      { title: 'Plan cash flow before deadlines', content: 'Estimate liability during the year, account for tax already deducted, and review whether advance-tax obligations apply. Keeping a reserve avoids last-minute borrowing or forced asset sales. Record payment references and reconcile them after processing.' },
      { title: 'Use calculators responsibly', content: 'A calculator can explain arithmetic and compare scenarios, but it cannot determine residency, income character, treaty treatment, eligibility evidence, or every special provision. Treat the result as an estimate and document the assumptions used.' },
    ],
    [
      { question: 'Is tax planning the same as tax avoidance?', answer: 'Legitimate planning applies the law to real transactions and keeps evidence. Concealment, false claims, or sham arrangements are not legitimate planning.' },
      { question: 'Which income-tax regime is better?', answer: 'It depends on current law, income composition, deductions, and personal circumstances. Compare both using complete information.' },
      { question: 'Can an online calculator file my return?', answer: 'No. A calculator estimates selected rules; filing requires complete data, classifications, disclosures, and validation.' },
      { question: 'Why must I verify 2026 tax information?', answer: 'Rates, rebates, forms, deadlines, and official interpretations can change. Use current Income Tax Department material or professional advice.' },
    ],
    'Keep complete records, compare regimes with actual inputs, plan payments early, and verify current law before relying on any estimate.',
  ),
  'macronutrients-guide': article(
    'Macronutrients Guide',
    'Understand protein, carbohydrate, fat, energy density, food quality, and practical meal balance.',
    'Protein, carbohydrate, and fat are called macronutrients because the body needs them in relatively large amounts. Each supports different functions, and the best balance depends on total energy needs, food preferences, health status, culture, activity, and goals.',
    [
      { title: 'Protein supports more than muscle', content: 'Protein supplies amino acids used in muscle, enzymes, immune proteins, and tissue repair. Needs vary with body size, age, energy intake, and training. Distributing protein-containing foods across meals can be practical, while extremely high intakes are not automatically better.' },
      { title: 'Carbohydrate is a flexible fuel source', content: 'Carbohydrates include sugars, starches, and fibre. Whole grains, legumes, fruit, vegetables, and dairy can provide carbohydrate alongside micronutrients and fibre. Athletes and highly active people may benefit from more carbohydrate around demanding training.' },
      { title: 'Dietary fat is essential', content: 'Fat supports cell membranes, hormones, and absorption of fat-soluble vitamins. Unsaturated fats from foods such as nuts, seeds, fish, and plant oils can fit a balanced pattern. Fat is energy dense, so portions matter when total energy is a goal.' },
      { title: 'Percentages are less important than the whole pattern', content: 'A macro calculator cannot judge food quality, allergies, gastrointestinal tolerance, micronutrient adequacy, or medical needs. Build a repeatable meal pattern first, then use macro targets only when they improve planning rather than create unnecessary rigidity.' },
    ],
    [
      { question: 'What is the best macro split?', answer: 'There is no single best split. A suitable range depends on energy needs, training, preferences, health, and professional guidance.' },
      { question: 'Are carbohydrates unhealthy?', answer: 'No. Carbohydrate foods vary widely; minimally processed, fibre-rich sources can be valuable parts of a balanced diet.' },
      { question: 'Do I need protein supplements?', answer: 'Not necessarily. They are convenient, but many people can meet needs with ordinary foods.' },
      { question: 'Should people with kidney disease use a macro calculator?', answer: 'They should obtain individualized advice because protein, minerals, fluids, and energy may require clinical management.' },
    ],
    'Choose a balanced food pattern that meets total energy and nutrient needs; use macro numbers as optional planning aids, not as a definition of food quality.',
  ),
  'json-formatting-guide': article(
    'JSON Formatting and Validation Guide',
    'Learn valid JSON syntax, formatting, validation, common errors, and safe handling of data.',
    'JSON is a text format for structured data. Formatting makes it readable; validation determines whether it follows the grammar. A document can be beautifully indented and still contain invalid JSON, while compact JSON can be completely valid.',
    [
      { title: 'The JSON data model', content: 'JSON supports objects, arrays, strings, numbers, booleans, and null. Object property names and strings use double quotes. Comments, trailing commas, undefined, functions, and unquoted keys are not part of standard JSON, even though some programming languages accept similar syntax.' },
      { title: 'Formatting versus validation', content: 'A formatter parses valid input and serializes it with consistent indentation. A validator reports syntax failures such as a missing comma, unmatched bracket, invalid escape, or unexpected character. Schema validation is a separate step that checks whether valid JSON has the required fields and value types.' },
      { title: 'Common errors and debugging method', content: 'Start at the first parser error, because later errors may be consequences. Check quote style, escapes, commas between members, matching braces and brackets, and number syntax. Reduce a large payload to the smallest failing structure when the location is unclear.' },
      { title: 'Privacy and large documents', content: 'Tokens, personal records, configuration secrets, and production payloads should not be pasted into unknown services. Prefer local processing for sensitive data. Very large JSON may require streaming tools because a browser parser typically holds the source and parsed object in memory at once.' },
    ],
    [
      { question: 'Does JSON allow comments?', answer: 'Standard JSON does not. Formats such as JSON5 add features, but they are not interchangeable with strict JSON parsers.' },
      { question: 'Why are my single quotes rejected?', answer: 'JSON strings and object property names require double quotes.' },
      { question: 'Is formatting the same as schema validation?', answer: 'No. Formatting changes presentation; schema validation checks the meaning and shape of already valid JSON.' },
      { question: 'Can formatting change data?', answer: 'A correct parse-and-serialize formatter preserves JSON values, though whitespace and sometimes key presentation may change.' },
    ],
    'Validate syntax first, distinguish grammar from schema rules, and keep sensitive payloads in a trusted local workflow.',
  ),
  'image-formats-guide': article(
    'Image Formats Guide',
    'Compare JPEG, PNG, WebP, SVG, GIF, AVIF, transparency, animation, and browser conversion trade-offs.',
    'An image format is a storage decision, not a quality ranking. The best choice depends on whether the asset is photographic or graphic, whether it needs transparency or animation, how it will be edited, and which browsers, applications, or print workflows must open it.',
    [
      { title: 'JPEG, PNG, and WebP', content: 'JPEG is widely compatible and efficient for photographs but is lossy and has no alpha transparency. PNG is lossless and supports transparency, making it useful for interface graphics and screenshots, though photographs can become large. WebP supports lossy and lossless modes, transparency, and animation with broad modern-browser support.' },
      { title: 'SVG is not a photograph container', content: 'SVG describes vector shapes and remains crisp at different sizes, making it excellent for icons, diagrams, and logos from trusted sources. Wrapping a raster image inside SVG does not convert it into editable vectors. Untrusted SVG can also contain active features and should be sanitized before embedding.' },
      { title: 'GIF and newer formats', content: 'GIF remains common for simple animation but has a limited colour palette. Animated WebP or video is often smaller for richer motion. AVIF can achieve strong compression, but encoding speed, tooling, and workflow compatibility should be checked before standardizing on it.' },
      { title: 'A practical selection workflow', content: 'Keep an editable master, export variants for delivery, and compare at the actual display size. Use responsive dimensions, preserve transparency only when needed, and verify visual quality rather than trusting a quality slider. Conversion cannot restore detail already lost in a low-quality source.' },
    ],
    [
      { question: 'Is WebP always smaller than JPEG?', answer: 'Often, but not always. Results depend on the encoder, quality setting, image content, and metadata.' },
      { question: 'Does converting PNG to JPG reduce quality?', answer: 'JPEG is lossy and removes transparency, so visual changes are possible. Flatten transparency onto an intentional background first.' },
      { question: 'Can a PNG be converted into a true SVG automatically?', answer: 'Only through vector tracing, which approximates shapes and may require cleanup. Changing the file wrapper alone does not create vectors.' },
      { question: 'Which format is best for a website logo?', answer: 'A sanitized SVG is usually ideal for a genuinely vector logo; PNG is a dependable fallback when vector source is unavailable.' },
    ],
    'Choose formats by content and delivery requirements, retain a master asset, and test output quality and compatibility at realistic dimensions.',
  ),
  'seo-tools-guide': article(
    'SEO Tools Guide',
    'Understand which SEO tools support crawling, indexing, performance, structured data, and search-quality analysis.',
    'SEO tools are measurement and implementation aids. They cannot guarantee rankings, and a high automated score does not replace useful content, accessible design, technical reliability, and accurate information. Start with the searcher’s task, then use tools to find obstacles and verify improvements.',
    [
      { title: 'Crawling and indexability tools', content: 'Search-console reports, URL inspection, robots testing, XML sitemap checks, and site crawlers help reveal whether important pages can be discovered and indexed. A page can be crawlable but still excluded for canonicalization, duplication, quality, or other reasons.' },
      { title: 'Content and query research', content: 'Keyword tools estimate demand and surface language patterns, but estimates differ. Group terms by intent and build the page that best completes the task. Avoid manufacturing near-duplicate pages for minor wording variations; comprehensive, clearly structured coverage is easier to maintain.' },
      { title: 'Performance and experience', content: 'Field data such as Core Web Vitals reflects real visits, while laboratory tests help diagnose a controlled load. Optimize images, fonts, scripts, caching, and rendering without removing useful functionality. Accessibility and clear interaction design support users even when they are not direct ranking shortcuts.' },
      { title: 'Structured data and safe automation', content: 'Schema should describe content actually visible on the page and use supported properties. Validate syntax and eligibility, but remember that rich results are not guaranteed. Automate repetitive checks—broken links, missing canonicals, duplicate titles—while keeping editorial judgment for claims and usefulness.' },
    ],
    [
      { question: 'Can an SEO tool guarantee a first-page ranking?', answer: 'No. Tools identify signals and issues; search engines make independent ranking decisions based on many factors.' },
      { question: 'Do meta keywords improve Google rankings?', answer: 'Google does not use the meta keywords tag for web ranking. Focus on descriptive titles, headings, visible content, and natural query coverage.' },
      { question: 'Does valid schema guarantee a rich result?', answer: 'No. It makes the page eligible when the markup and content meet applicable policies, but display remains the search engine’s decision.' },
      { question: 'Which SEO checks should be automated?', answer: 'Coverage checks such as status codes, canonicals, sitemap membership, title presence, structured-data syntax, and internal-link integrity are strong candidates.' },
    ],
    'Use SEO tools to discover, diagnose, and verify; prioritize helpful content, crawlable architecture, truthful schema, and fast accessible experiences.',
  ),
};
