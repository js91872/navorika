import type { GuideContent } from './guideContent';

const schema = (headline: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline,
  description,
  author: { '@type': 'Organization', name: 'Navorika' },
  datePublished: '2026-10-19',
  dateModified: '2026-10-19',
});

export const fertilizerGuideContent: Record<string, GuideContent> = {
  'how-to-calculate-fertilizer-for-a-lawn': {
    intro: "To calculate fertilizer for a lawn, you need three things: the area you plan to treat, a nutrient rate from a soil test or product instructions, and the N-P-K percentages on the fertilizer label. Those inputs let you work out product weight without guessing or treating a whole bag as the amount for every yard. This guide shows the math in plain language, explains the units, and walks through examples. Use the rate you were given; the examples below demonstrate arithmetic and are not application recommendations. For a live result, use Navorika's [Fertilizer Calculator](/tools/fertilizer-calculator).",
    sections: [
      {
        title: 'What a lawn fertilizer calculation tells you',
        content: `A fertilizer calculator answers a narrow question: given a target amount of one nutrient, a product with a stated nutrient percentage, and a measured area, how much product matches those inputs? It does not diagnose the lawn, decide whether fertilizer is needed, choose a product, or set the rate. Those decisions depend on a soil test, the plant or turf being grown, local conditions, product directions, and local rules. Keeping those questions separate is important because an arithmetic result can be exact while the rate entered is unsuitable.

The calculation usually starts with a nutrient rate such as pounds of nitrogen per 1,000 square feet. A fertilizer grade such as 26-5-10 says that each 100 pounds of product contains 26 pounds of nitrogen, 5 pounds of phosphate expressed as P₂O₅, and 10 pounds of potash expressed as K₂O. If a user-supplied rate calls for 1 pound of nitrogen per 1,000 square feet, a 26% nitrogen product needs about 3.85 pounds of product to supply that nitrogen for that rate area. The product also supplies the phosphate and potash shown by its label.

The area then scales the amount. A 5,000-square-foot lawn contains five units of 1,000 square feet. At the example rate, the result is about 19.23 pounds of product for the full area. That is the total product amount the entered rate calculates to; it is not a schedule or instruction to apply it all at once. Check the source of the rate and the product label before using any result.`
      },
      {
        title: 'Measure only the lawn area you plan to treat',
        content: `For a rectangular lawn, multiply its length by its width using the same unit for both measurements. A 50-foot by 100-foot rectangle is 5,000 square feet. For a triangular section, multiply its base by its perpendicular height and divide by two. For a circular area, multiply pi by the radius squared. Many yards combine these shapes, so measure separate sections and add their areas. If a building, patio, driveway, pond, or garden bed is not part of the treatment area, leave it out.

Avoid estimating the whole property from its lot size. The lot can include the house, paths, decks, planting beds, and other areas that should not be counted as lawn. Measure the green area that the product is meant to cover. If the lawn has a large irregular outline, split it into rectangles and triangles, estimate each one as carefully as practical, and subtract any obvious area inside the boundary that is not turf. Keep a note of the measurements so you can repeat the calculation consistently.

The [Square Footage Calculator](/tools/square-footage-calculator) can help find rectangular areas, and the [Land Area Converter](/tools/land-area-converter) can convert square feet and acres. One acre is 43,560 square feet. That fixed conversion is useful when a soil-test report or product direction uses acres but your yard measurements are in feet. The conversion changes area units only; it does not turn a lawn rate into a crop recommendation or make rates interchangeable between uses.`
      },
      {
        title: 'Find the nutrient rate and its unit',
        content: `Look for the rate on the soil-test report or product instructions relevant to the exact plant and area you are treating. A rate may be written per 1,000 square feet, per acre, or for some other area. It may specify nitrogen, phosphate, potash, or more than one nutrient. Confirm both the nutrient and the area basis before entering anything. A number without its nutrient name and unit is incomplete and should not be treated as a usable rate.

This matters when converting between a per-1,000-square-foot rate and a per-acre rate. There are 43.56 units of 1,000 square feet in an acre, so multiplying a rate per 1,000 square feet by 43.56 gives the equivalent amount per acre for the same area. Dividing an acre-based amount by 43.56 gives the amount per 1,000 square feet. The calculator handles the area conversion when you select the rate unit, but it cannot decide whether a rate belongs to the lawn or crop in front of you.

Do not copy a rate from a different plant, region, season, or product simply because the units look familiar. A lawn guide, garden soil report, and agricultural field recommendation can have different purposes. Use the original report or directions and keep its stated basis. If the report is unclear, ask the lab, extension office, or qualified local adviser who issued it before using the number.`
      },
      {
        title: 'Read the three fertilizer numbers',
        content: `The fertilizer grade is printed as three numbers separated by hyphens, for example 26-5-10. They refer to guaranteed percentages by weight, in this order: total nitrogen (N), available phosphate expressed as P₂O₅, and soluble potash expressed as K₂O. The numbers are not the product's recommended application rate, and they are not a ratio of parts to mix. They describe nutrient concentration in the product.

For the 26-5-10 example, 100 pounds of product contains 26 pounds of N, 5 pounds of P₂O₅, and 10 pounds of K₂O. A 10-pound quantity therefore contains 2.6 pounds N, 0.5 pound P₂O₅, and 1 pound K₂O, based on those guaranteed percentages. The remaining product weight consists of other ingredients, such as carriers or other labeled components. The exact formulation and additional guarantees vary, so use the label on the product you actually have.

The second and third label numbers use oxide forms. In everyday conversation, people may call them phosphorus and potassium, but the fertilizer grade convention is P₂O₅ and K₂O. Do not enter elemental P or K values from another document as if they were the label percentage. If the label uses a different format or units, check its directions or a reliable local source before calculating. See the related guide [Fertilizer N-P-K Numbers Explained](/guides/fertilizer-npk-numbers-explained) for a closer look at labels.`
      },
      {
        title: 'Use the formula for product weight',
        content: `When the target rate and label percentage refer to the same nutrient, divide the target nutrient amount by the nutrient fraction in the product. Write the percentage as a decimal: 26% becomes 0.26, 5% becomes 0.05, and 10% becomes 0.10. The simple formula for one rate area is:

Product weight = nutrient rate ÷ (label percentage ÷ 100)

For a lawn area different from the rate area, multiply the product amount by the number of rate areas in the lawn:

Total product = product per rate area × (lawn area ÷ rate area)

For example, if the supplied target is 1 pound of nitrogen per 1,000 square feet and the label's first number is 26, divide 1 by 0.26. The result is about 3.85 pounds of product for 1,000 square feet. For 5,000 square feet, multiply by five: about 19.23 pounds. Penn State Extension uses the same divide-by-the-label-percentage method in its turf calculation examples. Use the [Fertilizer Calculator](/tools/fertilizer-calculator) to perform the arithmetic once you have a valid rate.

The selected nutrient must be present in the fertilizer. A product with 0% of the target nutrient cannot meet a positive target rate, so division by zero has no meaningful result. If a product contains 0% N but the rate is for nitrogen, choose a product or approach based on the recommendation you were given; do not enter a pretend percentage.`
      },
      {
        title: 'Worked example: a measured lawn and a 26-5-10 label',
        content: `This example is for practicing the math, not for recommending a lawn application. Suppose a soil-test recommendation or product direction that applies to a particular site says to use 1.0 pound of nitrogen per 1,000 square feet. The measured treatment area is 5,000 square feet. The available product label is 26-5-10, and the bag weighs 40 pounds.

First, use the nitrogen percentage because the supplied rate is a nitrogen rate. Convert 26% to 0.26. Divide 1.0 by 0.26 to find the product per 1,000 square feet: approximately 3.846 pounds. Next, divide the lawn area by the rate area: 5,000 ÷ 1,000 = 5. Multiply 3.846 by 5. The calculated product amount for the full measured area is approximately 19.23 pounds.

The calculated nitrogen total is 5 pounds, because the example rate is 1 pound N across each of five 1,000-square-foot sections. The label also states 5% phosphate and 10% potash. At 19.23 pounds of product, those percentages correspond to about 0.96 pound P₂O₅ and 1.92 pounds K₂O for the full area. They are part of the product amount, not extra product to add.

Because the bag is 40 pounds, it contains enough product for more than this one example area at the entered rate. Dividing the bag weight by product needed per 1,000 square feet estimates its coverage: 40 ÷ 3.846 × 1,000, or roughly 10,400 square feet. That is a mathematical coverage estimate under the same rate and label assumptions. It does not say the unused product should be applied somewhere else.`
      },
      {
        title: 'Convert a per-acre rate without mixing up units',
        content: `A report or product direction may express the nutrient rate per acre. Keep the rate basis and treatment area clear. If the supplied rate is per acre, the calculator can multiply the product required per acre by the number of acres being treated. If the area is entered in square feet, it converts the measured area to a fraction of an acre or to the matching rate-area basis before scaling the quantity.

For a check by hand, use the same formula with the per-acre numbers. Suppose, only as a mathematical example, an instruction states 34 pounds of nitrogen per acre and the fertilizer label lists 34% nitrogen. The amount of product per acre is 34 ÷ 0.34 = 100 pounds. If the measured area is two acres, the product total is 200 pounds. The example does not say that 34 pounds of nitrogen per acre is suitable for any particular land; it only demonstrates how to apply a supplied rate.

One acre equals 43,560 square feet, or 43.56 units of 1,000 square feet. A common mistake is to multiply a per-1,000-square-foot rate by the number of acres without converting the area. Another is to enter an acre count in a square-foot field. Read the unit beside the rate and the unit beside the area before you calculate. If you are working from metric units, convert them carefully using the original source's specified units, or use a calculator built for those units.`
      },
      {
        title: 'Use bag coverage as a check, not as a rate',
        content: `A bag may state that it covers a certain area. Coverage usually depends on a particular rate and application setup, so it is not a universal property of the bag. When you know the bag weight, the product amount per rate area, and the rate basis, you can estimate coverage mathematically. For example, a 50-pound bag divided by 3.8 pounds per 1,000 square feet covers about 13,200 square feet at that example rate. Penn State Extension shows this type of calculation for a 50-pound fertilizer bag.

If the calculator shows 0.7 bags for the area, that means the calculated product weight is about 70% of one bag at the bag size entered. It does not mean that the remainder of the bag should be applied to the same site. If the result is 2.3 bags, the mathematical requirement is 2.3 bags' worth of product; buying whole bags may mean some product remains. Follow storage directions and keep products in their original container where appropriate.

Coverage figures can differ from a package estimate if your entered rate is different from the manufacturer's rate, your product grade is different, or your treated area is not measured accurately. The bag's own directions remain important. For a product-specific treatment setup or spreader setting, follow the current product instructions rather than assuming a generic calculator output provides those details.`
      },
      {
        title: 'Common mistakes and a final check before using the result',
        content: `The first common mistake is using the fertilizer grade as though it were the application rate. A 26-5-10 label tells you nutrient percentages; it does not tell you how many pounds to apply to a particular lawn. The second is using the wrong nutrient percentage. Match a nitrogen rate to the first number, a phosphate rate to the second, and a potash rate to the third. The third is confusing product pounds with nutrient pounds: 3.85 pounds of a 26% nitrogen product provides about 1 pound of nitrogen.

Area mistakes also matter. Measuring the whole property instead of the treatment area can inflate the total. Forgetting that acres and square feet are different units can produce an answer that is off by a large factor. Copying a rate but omitting “per acre” or “per 1,000 square feet” removes key information. Check that the nutrient, rate, area, units, and product label all describe the same task before trusting the arithmetic.

Use this short checklist: measure only the area to be treated; read the nutrient name and unit on the recommendation; copy the N-P-K numbers from the exact package; choose the matching rate basis; and compare the result with the product's directions. The calculator is a way to avoid repeating the division and area conversion by hand. It cannot verify that a recommendation is current, that a product is appropriate, or that the spreader delivers the calculated weight evenly.`
      },
      {
        title: 'Where the calculation stops',
        content: `A fertilizer amount calculation is only one part of lawn care. It does not account for soil pH, nutrient availability, grass species, climate, irrigation, rainfall, mowing, or the timing and number of treatments. Those are not small details that can be replaced by a single universal rate. The soil-test report and local extension guidance are more appropriate sources for deciding what the lawn needs. Product instructions explain how to handle and apply a specific product. Local restrictions can limit when or where nutrients may be used.

This page and its calculator provide arithmetic based on user-supplied values. They do not replace the source of those values. Do not increase a rate because the lawn looks pale or because an online example produced a larger number. If a soil report lists a nutrient recommendation that does not fit the fertilizer grade you have, the product may supply too much or too little of another nutrient. A local extension educator or the soil-testing lab can help interpret that mismatch.

For the calculation itself, continue with the [Fertilizer Calculator](/tools/fertilizer-calculator). For a label explanation, read [Fertilizer N-P-K Numbers Explained](/guides/fertilizer-npk-numbers-explained). For advice on interpreting the report, see [How to Calculate Fertilizer from a Soil Test](/guides/how-to-calculate-fertilizer-from-a-soil-test).`
      },
      {
        title: 'Check the calculation with a second method',
        content: `A simple hand check can catch a misplaced decimal or unit. Work one rate area first: divide the nutrient rate by the nutrient percentage written as a decimal. With a hypothetical rate of 0.8 pound of nitrogen per 1,000 square feet and a 20% nitrogen product, the product amount is 0.8 ÷ 0.20, or 4 pounds for that rate area. Then multiply by the number of rate areas in the lawn. A 3,500-square-foot area contains 3.5 units of 1,000 square feet, so the total is 14 pounds of product. This example illustrates the arithmetic only; use a current rate for the lawn from a qualified source.

Now reverse the calculation. Multiply the product amount for one rate area by the fertilizer percentage. Four pounds of a 20% nitrogen product contains 0.8 pound nitrogen. If that does not reproduce the entered rate, check whether the percentage was entered as 20 rather than 0.20 in a field labeled percent, and make sure the rate refers to nitrogen. The N-P-K order is fixed, so the first number is the one used for nitrogen.

For a larger property, check the scale factor separately. Divide the measured square feet by 1,000 to find how many per-1,000 units are present. For 7,250 square feet, that factor is 7.25. Multiplying 4 pounds by 7.25 gives 29 pounds for the whole measured area. If the rate is per acre, compare acres with acres or convert the area first. Dividing a per-acre nutrient amount by 43.56 converts it to the equivalent amount per 1,000 square feet because one acre contains 43.56 such units.

Keep product quantity and nutrient quantity distinct in notes and calculations. A result such as 29 pounds is the weight of the fertilizer product; it does not mean 29 pounds of nitrogen. Check the nutrient breakdown the calculator displays against the label percentages. For example, a product containing 5% phosphate supplies one fifth as much phosphate as a 25% nitrogen product amount supplies nitrogen, if the same product weight is used. That comparison can show why a product may provide extra nutrients alongside the one used to calculate the amount.

Finally, compare the arithmetic with the package directions and the source of the rate. If the units or the intended use do not match, pause and resolve the mismatch with the testing lab, extension office, or product manufacturer. A second calculation verifies only that the entered numbers were combined consistently. It cannot validate the recommendation itself, determine whether the lawn needs fertilizer, or account for local restrictions and site conditions.`
      },
    ],
    faqs: [
      { question: 'How much fertilizer should I put on my lawn?', answer: 'Use the nutrient rate provided for your lawn by a soil test or product directions. Then calculate the product weight from that rate, the label percentage, and the measured area. This guide does not set a lawn rate.' },
      { question: 'How many pounds is 1 pound of nitrogen from 26-5-10?', answer: 'For a hypothetical rate of 1 pound N per 1,000 square feet, divide 1 by 0.26. That is about 3.85 pounds of 26-5-10 product per 1,000 square feet.' },
      { question: 'How many square feet are in an acre?', answer: 'One acre is 43,560 square feet, which is 43.56 units of 1,000 square feet.' },
      { question: 'Does a fertilizer calculator tell me what fertilizer to use?', answer: 'No. It calculates product weight from the nutrient rate and label you enter. A soil test, product instructions, and local guidance help determine what rate or product applies.' },
    ],
    summary: "To calculate fertilizer for a lawn, measure the area, identify the nutrient and rate from a relevant soil-test recommendation or product direction, and copy the N-P-K percentages from the label. Divide the nutrient rate by the matching percentage written as a decimal, then scale the product quantity to the full area. Check area units, fertilizer directions, and local requirements before applying anything. Use the linked calculator for the arithmetic, not to choose the rate.",
    schema: schema('How to Calculate Fertilizer for a Lawn: Area, Rate & N-P-K', 'Calculate fertilizer product weight from a measured lawn area, a supplied nutrient rate, and N-P-K label percentages.'),
  },

  'fertilizer-npk-numbers-explained': {
    intro: "The three numbers on a fertilizer bag are a quick summary of its guaranteed nutrient analysis. A grade such as 10-10-10 or 26-5-10 gives percentages in a fixed order: nitrogen (N), phosphate (P₂O₅), and potash (K₂O). Those percentages describe what is in the product by weight; they do not tell you how much to spread on a lawn or garden. This guide explains how to read the label and how the numbers affect a fertilizer calculation. For a product amount based on a rate you already have, use Navorika's [Fertilizer Calculator](/tools/fertilizer-calculator).",
    sections: [
      {
        title: 'N-P-K is a label grade, not a mixing ratio',
        content: `Fertilizer grades are commonly shown as three numbers separated by hyphens. On a bag marked 10-10-10, the first 10 is total nitrogen, the second 10 is available phosphate expressed as P₂O₅, and the third 10 is soluble potash expressed as K₂O. The same order applies to 26-5-10, 18-0-6, and other grades. Read the guaranteed analysis on the actual package because labels may also list secondary nutrients and micronutrients elsewhere.

The grade is often called N-P-K, but the second and third numbers are oxide forms rather than elemental phosphorus and potassium. This convention is used on fertilizer labels. The grade does not mean “one part of each nutrient,” does not specify a dose for a lawn, and does not say that the product is a complete choice for every plant. It tells you the guaranteed percentage of each listed nutrient in the product by weight.

The numbers are also different from an analysis such as 5-10-5 being a 1:2:1 fertilizer ratio. The ratio is found by dividing all three grade numbers by their greatest common factor or by the lowest nonzero number for a simple proportion. But the original grade remains necessary for calculations because its percentages determine how much of a nutrient is in each pound of product.`
      },
      {
        title: 'The first number: nitrogen (N)',
        content: `The first number gives the percentage of total nitrogen in the product. Nitrogen is often central to leaf and shoot growth, so lawn recommendations may specify a nitrogen rate. That does not make nitrogen the right target in every case. A soil report, a crop plan, or product directions may focus on a different nutrient or on several nutrients at once. Always read which nutrient the rate actually names.

If a bag lists 26-5-10, the label guarantees 26% nitrogen by weight. In a simplified calculation, 100 pounds of that product contains 26 pounds of nitrogen. Ten pounds contains 2.6 pounds of nitrogen. If a supplied rate calls for 1 pound of nitrogen in a defined area, divide 1 by 0.26 to find the matching product weight for that area: about 3.85 pounds. The lawn or garden area then scales that product amount up or down.

Fertilizer labels may give more detail about nitrogen sources, including soluble or slow-release forms. Those details can affect product behavior and directions, but they do not change the meaning of the first number. Do not assume that two products with the same first number behave identically, or that the grade alone establishes a suitable application. Read the full analysis and instructions.`
      },
      {
        title: 'The second number: phosphate (P₂O₅)',
        content: `The middle number is the percentage of available phosphate expressed as P₂O₅. For a 26-5-10 product, the middle number is 5, so a simple by-weight calculation treats the product as containing 5% P₂O₅. Ten pounds of product at that grade contains 0.5 pound of phosphate expressed in this fertilizer-label convention.

Phosphate is not always needed in a fertilizer program. A soil test can show that phosphorus is already adequate or high, while a recommendation may call for a product with little or no phosphate. Applying a fertilizer that contains phosphate just because its nitrogen number fits a rate could also apply more phosphate than the report calls for. This is one reason a calculator should display all three nutrients supplied by the calculated product amount, not only the one used to solve for product weight.

When a soil report lists elemental phosphorus, P, instead of P₂O₅, do not enter that number directly as if it were the fertilizer label's second percentage or a matching fertilizer recommendation. The units and chemical forms differ. Follow the report's conversion instructions or ask the testing laboratory or extension office. Keep the product grade and the report units distinct until they have been reconciled.`
      },
      {
        title: 'The third number: potash (K₂O)',
        content: `The last number is soluble potash expressed as K₂O. A 26-5-10 label therefore indicates 10% K₂O in the third position. If you had 10 pounds of that product, 1 pound would be counted as K₂O using the label convention. As with phosphate, this number describes concentration, not the amount you should apply.

Potassium may be included with nitrogen and phosphate in many blends, but the right balance depends on the crop or lawn and the test results. If a recommendation calls for nitrogen only and the product has a substantial potash percentage, calculate both nutrient amounts and compare them with the relevant directions. A product that meets the nitrogen target might supply more potash than intended, depending on the grade. This does not mean one grade is universally best; it means the whole analysis matters.

If the soil report uses elemental potassium, K, rather than K₂O, confirm the units before comparing it with a fertilizer bag. Do not change the fertilizer label numbers. The manufacturer’s label is the source for the product percentages, while the report or local guidance is the source for the target amounts. Matching both sources carefully helps avoid an accidental mismatch.`
      },
      {
        title: 'What a 26-5-10 label means in pounds',
        content: `A percentage means parts out of 100 by weight. The numbers 26-5-10 therefore describe 26%, 5%, and 10% of the product for the three listed nutrient conventions. For each 100 pounds of this fertilizer, the label indicates 26 pounds N, 5 pounds P₂O₅, and 10 pounds K₂O. For a 40-pound bag, multiply each percentage by 40: 10.4 pounds N, 2 pounds P₂O₅, and 4 pounds K₂O, as label guarantees. The remaining mass can include carriers and other ingredients.

For a smaller amount, use the same multiplication. If you measure 3.85 pounds of 26-5-10 product, the approximate nutrient amounts are 3.85 × 0.26 = 1.00 pound N, 3.85 × 0.05 = 0.19 pound P₂O₅, and 3.85 × 0.10 = 0.39 pound K₂O. Rounding explains small differences in the displayed values. This example only shows what the product weight supplies; it is not an instruction to use 3.85 pounds on a particular site.

The percentages are not additive product quantities. If the amount of product is 3.85 pounds, that remains 3.85 pounds of product. The N, P₂O₅, and K₂O amounts are components represented within that product. Do not add those nutrient weights to the product amount or count them as separate bags.`
      },
      {
        title: 'How fertilizer percentages change the calculated amount',
        content: `When a supplied nutrient rate is matched to a fertilizer, divide the rate by the matching percentage written as a decimal. The formula is:

Product weight = target nutrient weight ÷ (label percentage ÷ 100)

For example, if a direction supplies a target of 1 pound N per 1,000 square feet, a 26% N product requires about 1 ÷ 0.26 = 3.85 pounds per 1,000 square feet. A 10% N product would require 1 ÷ 0.10 = 10 pounds for the same target and rate area. The calculated product weights differ because the nutrient concentrations differ. The rate in this illustration is for arithmetic practice, not a recommendation.

To calculate the entire area, multiply by the number of rate areas. If the measured lawn is 4,000 square feet and the rate is per 1,000 square feet, multiply the per-1,000 result by four. If the recommendation is per acre, use acres or convert area so the units match. Navorika's [Fertilizer Calculator](/tools/fertilizer-calculator) can calculate N, P₂O₅, or K₂O and show the other nutrients supplied by the same product amount.

If the selected nutrient's percentage is zero, that product cannot supply a positive amount of that nutrient. The calculation has no finite answer. A positive rate divided by zero is not a practical amount; select a product that matches the recommendation or ask a qualified local adviser how to proceed.`
      },
      {
        title: 'A fertilizer grade is not the same as a nutrient ratio',
        content: `The grade states nutrient percentages. A ratio describes their relative proportions. For example, 18-6-6 can be simplified to a 3-1-1 ratio by dividing each number by 6. A 30-10-10 product has the same 3-1-1 ratio but contains higher percentages of each listed nutrient, so less product would be needed to supply the same weight of nitrogen. A ratio alone cannot tell you the actual pounds of product required; the grade percentages and target rate are needed.

Sometimes soil-test reports or recommendations mention a fertilizer ratio. The ratio can help compare the relative balance of nutrients in products, but the exact grade still matters for calculating product quantity. A 3-1-1 ratio does not mean a fixed application rate or a fixed number of pounds. The product may be 18-6-6, 30-10-10, or another grade with the same proportions.

The ratio also does not show the entire product formulation. Labels may list other nutrients, ingredients, or release characteristics. If you are comparing products, inspect the guaranteed analysis and instructions rather than choosing from ratio alone. Penn State Extension's ratio guide explains the proportional comparison, while the fertilizer amount calculation still uses the relevant label percentage.`
      },
      {
        title: 'Check every number before using a calculator',
        content: `Start with the exact label and copy the first, second, and third numbers in order. Do not type the hyphenated grade into a single field if the calculator has separate percentage fields. Use 26 for 26%, not 0.26, when the interface asks for a percentage. The formula converts 26 to 0.26 internally. If a label shows 0 in a position, keep that zero rather than substituting a small number.

Next, confirm the target nutrient and rate unit. If a report calls for a certain amount of nitrogen, use N as the target nutrient. If it specifies phosphate or potash, use that nutrient instead. Check whether the rate is per acre, per 1,000 square feet, or another basis. Finally, enter the measured treatment area in the unit selected on the screen. Carefully distinguishing lb nutrient from lb product prevents one of the most common calculation errors.

The [Fertilizer Calculator](/tools/fertilizer-calculator) displays the full product weight and N-P-K amounts. Check the results against a hand calculation for one unit of area. If the label, soil test, or recommendation uses unfamiliar terms or units, stop and confirm them before applying fertilizer. A calculator cannot resolve an ambiguous source document.`
      },
      {
        title: 'What the N-P-K numbers cannot tell you',
        content: `The three numbers do not tell you whether the soil needs those nutrients, how often to apply the product, how to set a spreader, or whether a fertilizer is suitable for a specific plant. They do not describe every ingredient or guarantee how a product will behave in every soil and weather condition. Labels and local guidance provide the directions that a grade cannot supply.

Two products with identical grades may still differ in nutrient sources, coatings, particle size, release timing, and additional label claims. A calculation based on the grade treats the percentages as the guaranteed analysis by weight. It does not model how fast nutrients become available or how a spreader pattern distributes granules. For liquid fertilizers, volume conversions may need concentration and density data; a pounds-only label calculator should not be used to infer ounces or gallons.

Use the N-P-K grade as one input in a calculation, not as a complete fertilizer plan. A soil-test report can help identify the relevant nutrient target, and a product label can explain its specific application directions. When those sources conflict or do not match the product available, ask the lab, local extension service, or qualified adviser for help.`
      },
      {
        title: 'Read a fertilizer grade through a worked example',
        content: `Suppose a bag is labeled 24-6-12 and weighs 40 pounds. The first number means 24% nitrogen by weight, so 40 × 0.24 equals 9.6 pounds of nitrogen in the bag. The second means 6% phosphate expressed as P₂O₅, or 2.4 pounds in the bag. The third means 12% potash expressed as K₂O, or 4.8 pounds. These figures describe the guaranteed analysis, not a suggested amount to spread over a particular space.

If a valid recommendation calls for 0.6 pound of nitrogen per 1,000 square feet, the amount of this product for one rate area is 0.6 ÷ 0.24, or 2.5 pounds. That same 2.5 pounds of product also supplies 0.15 pound of phosphate and 0.30 pound of potash for the area, based on the label percentages. The calculator performs this division and scaling when you enter the rate and the grade. It does not decide whether 0.6 pound is a suitable rate; the example number is used only to show the math.

The same logic works when you calculate from phosphate or potash, as long as the recommendation names that nutrient and the product contains a nonzero amount of it. If a test recommendation specifies 0.4 pound of potash per 1,000 square feet and you use the same 12% product, the product amount would be 0.4 ÷ 0.12, or about 3.33 pounds for that rate area. This amount would supply nitrogen and phosphate too. Check those amounts against the test report because choosing a product to satisfy one nutrient can bring along others.

Remember that the middle and final numbers use conventional label expressions: phosphate as P₂O₅ and potash as K₂O. A soil report might use the same expressions, or it might use elemental phosphorus and potassium in a different context. Do not compare different nutrient forms as if their numbers were automatically interchangeable. Follow the reporting lab's instructions when the names or units do not line up.

If you are reading a liquid fertilizer label, confirm whether percentages are by weight or volume and what the labeled directions mean. Converting a weight of product to fluid ounces may require density or concentration information. The three numbers alone do not provide that conversion. Product label terminology and guaranteed analysis are the proper reference for that formulation.

A quick label check is to multiply a chosen product weight by each percentage divided by 100. For 2.5 pounds of a 24-6-12 product, the results are 0.6 pound N, 0.15 pound P₂O₅, and 0.30 pound K₂O. These amounts describe nutrients represented in the product, not separate product weights. If a calculator's nutrient breakdown does not agree, verify the three values were entered in label order and that the target nutrient matches the recommendation. Check whether the package lists additional nutrients separately; this basic calculation reports only the three primary grade values.

When comparing two products, calculate from the nutrient target rather than choosing the grade with the largest first number. A product with a higher nitrogen percentage may require less product weight to supply the same nitrogen amount, but the other percentages may differ too. Compare the full grade and directions with the report. Product price per bag by itself is not a fair comparison when bag sizes and nutrient percentages are different. The simple calculation can compare nutrient weights, while the label and local recommendation determine which product is appropriate for the intended use.`
      },
    ],
    faqs: [
      { question: 'What do fertilizer numbers 10-10-10 mean?', answer: 'They indicate 10% nitrogen, 10% phosphate expressed as P₂O₅, and 10% potash expressed as K₂O by weight.' },
      { question: 'Is 10-10-10 a ratio?', answer: 'The grade is a set of percentages. Its simplified nutrient ratio is 1-1-1, but the grade is needed to calculate how much product supplies a given nutrient amount.' },
      { question: 'How much nitrogen is in a 40-pound bag of 26-5-10?', answer: 'At 26% nitrogen, 40 × 0.26 = 10.4 pounds of nitrogen, based on the label guarantee.' },
      { question: 'Does a higher first number mean I should use less fertilizer?', answer: 'For the same supplied nitrogen target, a higher nitrogen percentage mathematically requires less product. It does not determine whether that target is appropriate.' },
    ],
    summary: "Fertilizer numbers are guaranteed nutrient percentages by weight, in a fixed order: nitrogen, phosphate expressed as P₂O₅, and potash expressed as K₂O. Use the percentage that matches the nutrient rate you were given, divide the target nutrient amount by that percentage as a decimal, and scale for the measured area. The label grade does not choose a suitable rate or application schedule.",
    schema: schema('Fertilizer N-P-K Numbers Explained: What the Label Means', 'Learn what the fertilizer label numbers N-P-K represent and how the percentages affect a product-weight calculation.'),
  },

  'how-to-calculate-fertilizer-from-a-soil-test': {
    intro: "A soil-test report may give a nutrient rate for a defined area, while a fertilizer bag gives nutrient percentages. To find the product weight that matches the report, identify the nutrient and unit on the report, read the N-P-K percentages on the product, and scale the calculation to your measured area. This guide explains the steps and common unit mix-ups. It does not interpret a test result or recommend a rate. Follow the soil-testing lab's instructions and local guidance. You can enter an existing rate in Navorika's [Fertilizer Calculator](/tools/fertilizer-calculator).",
    sections: [
      {
        title: 'Read the report before doing the math',
        content: `Find the specific recommendation and copy its nutrient name, amount, and area basis. A report may show nitrogen, phosphate, or potash; it may use pounds per 1,000 square feet, pounds per acre, or another unit. It can also include a product grade suggestion or a note about timing, placement, or retesting. Record the recommendation as written before converting anything. If a label or report abbreviation is unclear, contact the soil-testing laboratory or local extension office that produced it.

Do not use only a soil-test concentration or rating as though it were an application rate. Reports can show levels such as low, medium, or high, test-method results, pH, and nutrient recommendations. These are different kinds of information. The calculator needs a target nutrient amount per defined area, not only a soil concentration or a general rating. The lab's interpretation connects the measurement to the site's crop, state, and method.

Also check that the recommendation applies to the site you plan to treat. A lawn, garden bed, field crop, and container mix are not interchangeable contexts. A recommendation from one area may use different assumptions from another. The arithmetic tool cannot determine whether a report is meant for your location or plant. If multiple recommendations appear, use the applicable one and retain the source and date with your notes.`
      },
      {
        title: 'Match the soil-test nutrient to the product label',
        content: `Fertilizer grades show three label percentages in a standard order: nitrogen (N), phosphate (P₂O₅), then potash (K₂O). A nitrogen target uses the first percentage. A phosphate target uses the second, and a potash target uses the third. If the test report names more than one nutrient, calculate each requested nutrient and compare the resulting amounts. Do not quietly substitute one for another.

For example, if a report gives a nitrogen rate and the available product is 24-0-8, the relevant label percentage for the product-weight calculation is 24. The 0 in the second position means that the product provides no guaranteed phosphate percentage. The third number matters when checking the potash supplied by the resulting product amount. The product may meet the nitrogen arithmetic while also supplying potash, which should be compared with the report and instructions.

Sometimes a suggested fertilizer ratio and a product grade do not line up exactly with every nutrient recommendation. A product that provides the required amount of one nutrient may over-apply or under-apply another. Utah State University Extension demonstrates comparing soil-test nutrient needs with product formulation in its fertilizer guidance. If there is a mismatch, do not force the calculation to fit by changing the report's rate; ask the lab or a qualified local adviser about product selection.`
      },
      {
        title: 'Use the rate and fertilizer percentage formula',
        content: `For a target nutrient amount and a product percentage, the product weight per rate area is:

Product weight = target nutrient rate ÷ (fertilizer percentage ÷ 100)

The percentage must be written as a decimal for division. For example, 24% is 0.24. If a report says 0.6 pound of a nutrient per 1,000 square feet and the matching label percentage is 24%, then the product amount for that rate area is 0.6 ÷ 0.24 = 2.5 pounds. This example shows only the formula; whether the rate applies depends on the test report and directions.

To scale from 1,000 square feet to a larger treatment area, multiply by measured area and divide by 1,000. The complete formula is:

Total product = (target nutrient rate ÷ nutrient fraction in product) × (treatment area ÷ rate area)

If the report gives pounds per acre, keep the rate per acre and enter acres or convert the measured area to acres. One acre equals 43,560 square feet. Penn State Extension and University of Maryland Extension present the same core arithmetic for fertilizer calculations. Navorika's [Fertilizer Calculator](/tools/fertilizer-calculator) supports a rate per acre or per 1,000 square feet and shows the N-P-K supplied by the amount.`
      },
      {
        title: 'Keep area and rate units consistent',
        content: `A rate always has an area attached. “2 pounds” alone does not say how large an area that amount covers. The report may say 2 pounds per 1,000 square feet, while your measured area may be 7,500 square feet. In that case, the area contains 7.5 groups of 1,000 square feet. Use the same basis in the multiplication and divide by that basis so the units cancel correctly.

If your recommendation is per acre but your lawn is measured in square feet, convert one side or the other. Since an acre is 43,560 square feet, the lawn's area in acres is square footage divided by 43,560. Or convert an acre-based recommendation to a 1,000-square-foot basis by dividing by 43.56. Do not treat one acre as 1,000 square feet or multiply by 43.56 twice.

For a practical check, write units beside every number: pounds of nutrient per acre, pounds product per acre, acres treated. When the multiplication and division cancel to pounds of product for the full area, the setup is likely dimensionally consistent. When the answer still has “per 1,000 square feet” but you need a whole-field total, one more area-scaling step is needed. The calculator handles standard US area units, but you are still responsible for selecting the report's actual unit.`
      },
      {
        title: 'Worked example: a report rate and a 24-0-8 product',
        content: `Suppose a report for a specific site supplies a hypothetical rate of 0.6 pound of nitrogen per 1,000 square feet. The measured area is 7,500 square feet, and the product label is 24-0-8. This is an example of applying arithmetic to a supplied value, not a recommendation for any lawn or garden.

First, match the rate to nitrogen, the first label number. Convert 24% to 0.24. Divide 0.6 by 0.24 to find the product weight per 1,000 square feet: 2.5 pounds. Second, find how many 1,000-square-foot units fit into 7,500 square feet: 7.5 units. Third, multiply 2.5 by 7.5. The calculated total is 18.75 pounds of product for the full area at that hypothetical rate.

Check the nutrients supplied by that product weight. The 24-0-8 grade means 24% nitrogen, 0% phosphate expressed as P₂O₅, and 8% potash expressed as K₂O. Eighteen point 75 pounds of product supplies 4.5 pounds nitrogen across the 7,500 square feet, which matches 0.6 pound across each of 7.5 units. It supplies no guaranteed phosphate, and it supplies 1.5 pounds K₂O across the area. Compare these outputs with the report and product directions; do not apply the example values to a different site.`
      },
      {
        title: 'When a report calls for more than one nutrient',
        content: `Some recommendations list a target for nitrogen and a separate target for phosphate or potash. One fertilizer product may not match all of them at the same time. Calculate the product weight for each nutrient separately to understand the relationship, then compare whether those weights agree. If they do not, applying the amount that satisfies the highest one could exceed another target. A soil test can also advise against adding a nutrient that is already adequate or high.

The grade's relative balance can help compare products. A 3-1-1 ratio means the first listed nutrient is three times the other two by proportion, but the exact percentage determines product weight. Two grades can share a 3-1-1 ratio while containing different total concentrations. A ratio is not an application rate, and a calculator should not use it in place of the label percentages.

If the report recommends nutrients that no single product matches, do not guess at a blend. Product choice and combining fertilizers involve additional instructions, compatibility, equipment, and nutrient limits. Ask the testing lab, extension service, or agronomist how to interpret the mismatch. The calculator can show what a chosen grade supplies, but it cannot optimize a blend or decide which nutrient target should take priority.`
      },
      {
        title: 'Check the full product label and bag directions',
        content: `N-P-K percentages are only one part of a fertilizer label. A package can include other guaranteed nutrients, a specific use, instructions, precautions, release information, and storage guidance. The calculator uses the three main percentages as stated and assumes they are percentages by weight. It does not account for formulation details beyond those values, application equipment, spreader calibration, weather, or the condition of the site.

If the product label gives a coverage rate or application directions, compare them with the rate from the report. They may describe different purposes or units. A mathematically calculated product weight does not override the label. Use the product-specific instructions for handling, timing, placement, watering, protective measures, and other application details. Local rules may place limits on fertilizer use near waterways or during certain periods.

If you have a liquid product, do not convert a weight result to ounces or gallons without the required concentration and density information. Liquid products can state nutrient percentages or application rates in different ways. A calculator designed for dry product weight cannot safely infer a liquid volume from the N-P-K grade alone. Check the liquid product label or a dedicated method from its manufacturer.`
      },
      {
        title: 'Common soil-test calculation errors',
        content: `One error is mistaking a soil-test result for a product rate. A nutrient concentration, category, or pH reading is not automatically pounds to apply. Use the recommendation section or guidance that interprets the test. Another error is copying the amount but omitting the area basis. The phrase “0.6 pounds per 1,000 square feet” contains a rate; “0.6 pounds” does not.

A third error is matching the target to the wrong N-P-K number. Nitrogen uses the first, phosphate the second, potash the third. A fourth is entering 24 instead of 0.24 into a hand calculation, or conversely entering 0.24 into a calculator field asking for a percentage. Follow the interface labels. A fifth is treating the calculated product weight as nutrient weight. For a 24% product, 10 pounds of product contains 2.4 pounds nitrogen, not 10 pounds nitrogen.

Finally, do not round too early. Keep a few decimal places through intermediate steps and round the final product amount to a practical measurement only after calculation. Rounding to whole pounds per 1,000 square feet before scaling can noticeably change the total for a large area. Follow any precision limits on the report or equipment and use an appropriate scale.`
      },
      {
        title: 'A practical checklist for using the result',
        content: `Before you calculate, confirm that you have the report for the site and plant in question. Write down the nutrient target, number, and area unit. Measure the portion to be treated, excluding buildings and other untreated areas. Copy all three percentages from the product's guaranteed analysis. Select the nutrient that matches the recommendation and use the same area basis as the report.

After the calculation, check the units: is the output pounds of product or pounds of nutrient? Does it cover the full area or only one rate unit? Review the other nutrients that the product supplies and compare them with the report. Check the product label and local requirements before deciding how to use the product. Save the original soil report and note the product grade and area used so the result can be reviewed later.

For arithmetic, use the [Fertilizer Calculator](/tools/fertilizer-calculator). For help reading the grade, see [Fertilizer N-P-K Numbers Explained](/guides/fertilizer-npk-numbers-explained). For a lawn example, see [How to Calculate Fertilizer for a Lawn](/guides/how-to-calculate-fertilizer-for-a-lawn). If the report does not state a rate or you cannot tell which nutrient it refers to, stop and ask the source rather than entering a guess.`
      },
      {
        title: 'How to verify the amount before using it',
        content: `A reliable check begins by writing the units beside every number. For example, note “0.6 lb N / 1,000 sq ft,” “24% N,” “2.5 lb product / 1,000 sq ft,” and “5,000 sq ft treated area.” The units show which quantities can be divided and which factor scales the result. Leaving out “per 1,000 square feet” can turn a correct number into a misleading one.

Calculate the product weight for a single rate area, then multiply by the number of rate areas. For the example above, 0.6 ÷ 0.24 = 2.5 pounds of product per 1,000 square feet. A 5,000-square-foot treatment area has five such units, so 2.5 × 5 = 12.5 pounds total. Reverse the calculation: 12.5 pounds of 24% nitrogen product contains 3 pounds N in total, or 0.6 pound N per 1,000 square feet. The example is for checking arithmetic and does not recommend a rate.

If the report uses acres, keep that basis visible. Two acres contain 87,120 square feet. A rate of 34 pounds per acre applies to two rate areas and yields 68 pounds of the named nutrient before dividing by the product fraction. Alternatively, if the measured area is in square feet, convert the recommendation by dividing its per-acre figure by 43.56 to express it per 1,000 square feet. Choose one method and avoid converting both area and rate twice.

The result from the formula is product weight, which may be fractional. A bag calculator can also show the exact fraction of a package needed and the number of whole packages to purchase. Buying whole bags does not mean applying the unused amount to the site. Store the remainder according to the label. Before rounding the amount to match a scale or spreader, check the precision and calibration instructions provided for the product and equipment.

Compare the nutrient breakdown from the product amount with every relevant target on the report. If the fertilizer satisfies the nitrogen calculation but supplies an amount of phosphate or potash that does not fit the report, the arithmetic is still internally consistent; the product choice may not be a match. Do not change the test's recommendation to make a product fit. Contact the laboratory or local extension office when you need help interpreting a mismatch, a unit, or a report that lists no explicit rate.

Keep a copy of the input values with the result if you will need to revisit it. Record the report date, test location, relevant recommendation, fertilizer brand and grade, measured area, and the units you used. This short record makes it easier to spot a stale report, a changed product, or a different treated area the next time you calculate. It also gives the lab or extension office the details needed to answer questions. Avoid copying a result without its assumptions: 12.5 pounds of product only has meaning alongside the nutrient target, label percentage, rate basis, and area.

If the calculator and hand check differ, trace the inputs in order instead of adjusting the rate until the answers look similar. Confirm that the selected nutrient is correct, the N-P-K grade is transcribed in order, the percentage field expects a whole percent, the area uses the selected unit, and the rate basis matches the report. Then compare the displayed product weight for one rate area with your division before checking the full-area total. This sequence helps isolate whether the problem is a transcription, unit conversion, or scaling issue. A calculator should reproduce the stated calculation; a mismatch in source documents still needs to be resolved by the lab or qualified local adviser.`
      },
    ],
    faqs: [
      { question: 'Can a calculator tell me what my soil test means?', answer: 'No. It can calculate product weight from an existing nutrient rate. The testing lab or local extension guidance is needed to interpret the report.' },
      { question: 'How do I convert a rate per acre to a 1,000-square-foot rate?', answer: 'Divide the per-acre amount by 43.56, because one acre contains 43.56 areas of 1,000 square feet.' },
      { question: 'What if my fertilizer does not match every soil-test nutrient?', answer: 'The product may meet one target while supplying too much or too little of another. Ask the soil lab or a qualified local adviser about product selection rather than changing the recommendation yourself.' },
      { question: 'Can I use a report from another yard?', answer: 'A report may not apply to a different site, plant, soil, or test method. Use the report and interpretation for the area you are treating.' },
    ],
    summary: "To calculate fertilizer from a soil test, use the report's nutrient rate and area unit, match the nutrient to the correct N-P-K label percentage, divide by that percentage as a decimal, and scale the result to the measured area. Check all units and review the other nutrients supplied by the chosen product. The calculator does not interpret the test or recommend a rate; ask the lab or local extension service when the report is unclear.",
    schema: schema('How to Calculate Fertilizer from a Soil Test', 'Calculate fertilizer product weight from a soil-test nutrient rate, measured area, and fertilizer label percentages.'),
  },
};
