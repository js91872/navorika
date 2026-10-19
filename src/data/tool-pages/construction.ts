Warning: truncated output (original token count: 37929)
Total output lines: 1322

import type { ToolPageContent } from '@/lib/seo/toolPage';

function expansionPage(input: { name:string; description:string; keywords:string[]; intro:string; formula:string; interpretation:string; limitations:string[]; relatedTools:{slug:string;name:string}[]; faq:{question:string;answer:string}[] }): Omit<ToolPageContent,'slug'> {
  return {name:input.name,description:input.description,longTailKeywords:input.keywords,category:'Construction Calculators',applicationCategory:'UtilitiesApplication',intro:[input.intro,'Inputs and calculations stay in your browser and require no signup.'],formula:[{title:'Planning calculation',body:input.formula}],steps:['Enter measured project dimensions and quantities.','Adjust material, spacing, waste or density assumptions to match the project.','Review the live planning quantities.','Round purchasing quantities appropriately and confirm field conditions.'],interpretation:[input.interpretation,'Results use the units shown beside each field and output.'],limitations:input.limitations,faqs:input.faq,relatedTools:input.relatedTools,relatedGuides:[]};
}

const planningLimits = ['Results are planning estimates, not engineering, supplier, hauling, compaction, or safety advice.', 'Confirm measured dimensions, material density, waste, load capacity, local units, and supplier minimums before ordering.'];

export const constructionToolPages: Record<string, ToolPageContent> = {
  '12-foot-gambrel-roof-truss-calculator': {
    slug: '12-foot-gambrel-roof-truss-calculator',
    name: '12 Foot Gambrel Roof Truss Calculator – Rafter Lengths & Angles',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate rafter lengths, roof height, pitch angles, break point and roof area for a 12-foot gambrel roof truss with an interactive diagram.',
    longTailKeywords: ['12 foot gambrel roof truss calculator', '12 ft gambrel roof calculator', 'gambrel roof truss calculator', 'gambrel rafter calculator', 'gambrel roof angle calculator', 'gambrel roof dimensions calculator', 'barn roof truss calculator', 'gambrel shed roof calculator'],
    intro: [
      'Plan the four-segment geometry of a gambrel roof from its span, two roof angles, and knee or break position. The span starts at 12 feet but remains editable for other measured buildings.',
      'The calculator also estimates truss quantity, sloped rafter length, roof surface area, roofing squares, and a selectable waste allowance entirely in the browser.',
    ],
    formula: [
      { title: 'Horizontal runs', body: 'Half-span = full span ÷ 2. Lower run = half-span × break proportion; upper run is the remaining half-span.' },
      { title: 'Vertical rises', body: 'Each rise equals its horizontal run × tan(the corresponding roof angle). Total roof height is lower rise + upper rise.' },
      { title: 'Rafter lengths', body: 'Each lower and upper rafter is the hypotenuse √(run² + rise²). Both sides are added for total sloped rafter length per truss.' },
      { title: 'Roofing area', body: 'Overhang-adjusted sloped length across both sides × building length including both end overhangs. Waste is applied after geometric area.' },
      { title: 'Truss quantity', body: 'Estimated trusses = ceil(building length ÷ truss spacing) + 1, using consistent units and a truss at each end.' },
    ],
    steps: ['Confirm the wall-to-wall span and building length; the initial span is 12 ft.', 'Enter the uniform horizontal overhang and intended truss spacing.', 'Adjust lower angle, upper angle, and the lower-run share of the half-span while watching the diagram.', 'Choose a roofing waste factor and review geometry, rafter, truss, and roof-area results.', 'Verify framing members, connections, loads, and layout using applicable plans and codes before construction.'],
    interpretation: [
      'The knee or break height equals the lower-section rise; moving the break changes both horizontal runs.',
      'Lower and upper rafter results are geometric lengths between the eave, knee, and ridge before connection cuts.',
      'Roofing squares include the selected waste factor; one square equals 100 square feet.',
      'The approximate total rafter lumber includes the geometric eave extensions but does not include webs, bottom chords, blocking, gussets, or cutting allowance.',
    ],
    limitations: [
      'Planning tool: This calculator estimates gambrel roof geometry and material quantities. It does not determine structural capacity or certify a truss design. Member sizes, lumber grades, gussets, connections, snow loads, wind loads and other structural requirements should be verified against applicable building codes and, where required, by a qualified professional.',
      'Displayed roof angles are geometric slope angles, not universal saw, miter, compound-cut, or connection instructions.',
      'The model assumes a symmetrical roof, straight segments, uniform horizontal overhang on all sides, and uniform truss spacing.',
      'Roofing accessories, sheet layout, laps, openings, ridge products, flashing, fascia, and supplier coverage are not separately included.',
    ],
    faqs: [
      { question: 'How long are the rafters for a 12-foot gambrel roof?', answer: 'Length depends on both angles and the break position. With the 60°/30° equal-run defaults, each lower segment is 6.00 ft and each upper segment is about 3.46 ft before connection cuts.' },
      { question: 'What angle should a gambrel roof be?', answer: 'There is no universal pair. The 60° lower and 30° upper defaults create a recognizable planning shape, but appearance, clearance, loads, materials, and engineered details can require different geometry.' },
      { question: 'How do you calculate gambrel roof height?', answer: 'Multiply each horizontal run by the tangent of its angle, then add the lower and upper rises.' },
      { question: 'How many trusses are needed for a 12×16 shed?', answer: 'Using 24-inch spacing and the calculator’s end-truss convention gives ceil(16 ÷ 2) + 1 = 9 trusses. Actual end-wall framing can differ.' },
      { question: 'What is the difference between a gambrel roof and a gable roof?', answer: 'A gable normally has one straight slope per side. A gambrel has a lower and upper slope on each side, often creating more usable volume under the roof.' },
      { question: 'Can this calculator design a structurally safe roof truss?', answer: 'No. It calculates geometry and preliminary quantities only; it does not size members, gussets, fasteners, or connections or evaluate code loads.' },
      { question: 'How does truss spacing affect the number of trusses?', answer: 'Closer spacing creates more spaces along the same building length, so the rounded truss quantity increases.' },
      { question: 'How do I calculate roofing area for a gambrel roof?', answer: 'Add the lower and upper sloped lengths per side, include the entered eave overhang, multiply both roof sides by the end-overhang-adjusted building length, then add waste.' },
    ],
    relatedTools: [{ slug: 'roof-area-calculator', name: 'Roof Area Calculator' }, { slug: 'roof-pitch-calculator', name: 'Roof Pitch Calculator' }, { slug: 'board-foot-calculator', name: 'Board Foot Calculator' }, { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' }],
    relatedGuides: [],
  },
  'roof-pitch-calculator': {slug:'roof-pitch-calculator',...expansionPage({name:'Roof Pitch Calculator',description:'Convert rise and run into X:12 pitch, angle, percentage, rafter multiplier and optional geometric rafter length.',keywords:['roof pitch calculator rise run','6 12 roof angle calculator','rafter multiplier calculator'],intro:'Translate roof rise and horizontal run into several common slope formats.',formula:'Slope = rise ÷ run; angle = arctangent of slope; multiplier = √(1 + slope²).',interpretation:'A 6:12 roof rises 6 units per 12 horizontal units, which is a 50% slope and about 26.565°.',limitations:['Geometry does not establish rafter size, load capacity, connections or code compliance.','Use actual horizontal run for rafter length and separately account for overhangs and cuts.'],relatedTools:[{slug:'roof-area-calculator',name:'Roof Area Calculator'},{slug:'ladder-safe-reach-calculator',name:'Ladder Safe Reach Calculator'}],faq:[{question:'What angle is a 6:12 pitch?',answer:'Approximately 26.565 degrees.'},{question:'Is pitch the same as percent slope?',answer:'They describe the same slope differently; 6:12 equals 50%.'},{question:'Does this size rafters?',answer:'No. It calculates geometry only.'}]})},
  'stair-stringer-calculator': {slug:'stair-stringer-calculator',...expansionPage({name:'Stair Stringer Calculator – Riser, Tread & Stringer Length',description:'Calculate stair risers, treads, total run, stringer length and stair angle from the measured rise.',keywords:['stair stringer calculator','stringer length calculator','riser tread calculator','stair total run calculator','what size stringer do i need','stair riser calculator','calculate stair stringer length'],intro:'Enter the total rise and tread settings to calculate equal risers, total run, stair angle and the geometric stringer length.',formula:'Risers round up from total rise ÷ maximum riser; treads are one fewer; the stringer is the right-triangle hypotenuse.',interpretation:'Actual riser height is recalculated so every riser is equal after choosing a whole riser count.',limitations:['Planning only; no universal code-compliance claim is made.','Verify local limits, headroom, landings, nosing, guards, handrails and stringer strength.'],relatedTools:[{slug:'ladder-safe-reach-calculator',name:'Ladder Safe Reach Calculator'},{slug:'saw-kerf-calculator',name:'Saw Kerf Calculator'}],faq:[{question:'Why are there fewer treads than risers?',answer:'A typical stair flight ends at the upper floor, leaving one fewer horizontal tread.'},{question:'Are all risers equal?',answer:'The tool divides total rise evenly across the calculated whole number of risers.'},{question:'Does it guarantee code compliance?',answer:'No. Requirements vary by jurisdiction and configuration.'}]})},
  'deck-board-calculator': {slug:'deck-board-calculator',...expansionPage({name:'Deck Board Calculator',description:'Estimate deck board rows, stock boards, linear footage, face coverage and waste with correct gap spacing.',keywords:['deck board calculator with spacing','decking linear feet calculator','actual deck board width'],intro:'Plan decking from deck dimensions, actual board width, gap, orientation and available stock length.',formula:'Rows satisfy rows × board width + (rows − 1) × gap across the deck; each row is divided by stock length.',interpretation:'The result distinguishes board-face coverage from the deck footprint and counts stock boards after waste.',limitations:['Enter actual rather than nominal lumber width.','Layouts with picture frames, diagonal boards, complex joints or mixed stock lengths need additional allowance.'],relatedTools:[{slug:'board-foot-calculator',name:'Board Foot Calculator'},{slug:'saw-kerf-calculator',name:'Saw Kerf Calculator'}],faq:[{question:'Are gaps included?',answer:'Yes. The row calculation explicitly includes spacing between boards.'},{question:'What does orientation change?',answer:'It swaps which deck dimension defines row length and which defines the number of rows.'},{question:'Should I enter nominal width?',answer:'No. Use the board’s actual face width.'}]})},
  'fence-calculator': {slug:'fence-calculator',...expansionPage({name:'Fence Calculator',description:'Estimate straight-run fence sections, panels, a minimum post count and optional rails.',keywords:['fence panel and post calculator','fence post spacing calculator','fence gate material estimate'],intro:'Turn a fence run into a preliminary material count while keeping gate openings and panel allowance explicit.',formula:'Gate widths are removed from fenced length; remaining length is divided into sections, and each gate creates another fence run for the minimum post count.',interpretation:'The post result is a straight-run planning lower bound because corner-leg lengths and gate positions are not entered.',limitations:['Exact multi-leg layouts require each leg and gate position to be taken off separately.','Irregular terrain, bracing assemblies, double gates and shared corner conditions may change counts.','Confirm property lines, utilities, frost depth, wind design and local requirements.'],relatedTools:[{slug:'post-hole-concrete-calculator',name:'Post Hole Concrete Calculator'},{slug:'construction-estimate-builder',name:'Construction Estimate Builder'}],faq:[{question:'Are gate widths subtracted?',answer:'Yes. Entered gate openings reduce the fenced length.'},{question:'What does panel mode do?',answer:'It applies the entered allowance to base sections and rounds only whole purchased panels.'},{question:'Is the post count an exact layout?',answer:'No. It is a straight-run lower bound; segment each real fence leg and locate gates for an exact takeoff.'}]})},
  'post-hole-concrete-calculator': {slug:'post-hole-concrete-calculator',...expansionPage({name:'Post Hole Concrete Calculator',description:'Calculate how much concrete you need for post holes after subtracting the space taken by round or rectangular posts, with cubic yards and bag estimates.',keywords:['post hole concrete bag calculator','fence post concrete volume','post displacement concrete calculator'],intro:'Estimate the concrete that fills the space between each post hole and the post placed inside it.',formula:'Net concrete = cylindrical hole volume − post volume, multiplied by the whole hole count.',interpretation:'Post displacement is reported separately and always reduces net concrete relative to an empty hole.',limitations:['Actual holes are rarely perfect cylinders and may widen or collapse.','Use manufacturer bag yield and local footing or frost-depth requirements.'],relatedTools:[{slug:'fence-calculator',name:'Fence Calculator'},{slug:'concrete-calculator',name:'Concrete Calculator'}],faq:[{question:'Does the post reduce concrete quantity?',answer:'Yes. Round and rectangular post displacement is subtracted.'},{question:'Can I enter bag yield?',answer:'Yes. Use the cured-volume yield printed by the concrete manufacturer.'},{question:'Are hole dimensions in inches?',answer:'Yes, while results convert to cubic feet and yards.'}]})},
  'drywall-calculator': {slug:'drywall-calculator',...expansionPage({name:'Drywall Calculator',description:'Estimate net drywall area, sheets, waste, screws, tape and compound from walls, ceilings and openings.',keywords:['drywall sheet calculator with openings','sheetrock material calculator','drywall screws tape compound estimate'],intro:'Plan sheet quantities from either wall dimensions or known area with optional ceiling and opening adjustments.',formula:'Net area = wall + ceiling − openings; sheets round up after applying waste to net area.',interpretation:'Screws, tape and compound are approximate planning allowances tied to sheet count or net area.',limitations:['Fastener schedules, finish level, framing spacing and board layout affect actual consumption.','Tape and compound allowances are approximate and should be checked against product coverage.'],relatedTools:[{slug:'construction-estimate-builder',name:'Construction Estimate Builder'},{slug:'paint-calculator',name:'Paint Calculator'}],faq:[{question:'Can I subtract doors and windows?',answer:'Yes. Enter their combined opening area.'},{question:'Can I include a ceiling?',answer:'Yes. Ceiling area is optional and added before openings are subtracted.'},{question:'Are screws exact?',answer:'No. They are a clearly labeled planning allowance.'}]})},
  'paver-calculator': {slug:'paver-calculator',...expansionPage({name:'Paver Calculator',description:'Calculate exact base paver quantity, allowance-adjusted quantity, whole units and pallets from project dimensions.',keywords:['patio paver calculator','paver count by size','pavers per pallet calculator'],intro:'Convert project area and individual paver dimensions into an unrounded material requirement and supplier quantities.',formula:'Exact pavers = project area ÷ paver face area; waste is applied to that exact value before whole pavers and pallets round upward.',interpretation:'Base geometry, allowance-adjusted quantity and whole-unit purchasing are reported separately.',limitations:['Joint spacing and pattern cuts are represented only through the waste allowance.','Verify actual packaged count, dimensions and pattern coverage with the supplier.'],relatedTools:[{slug:'polymeric-sand-calculator',name:'Polymeric Sand Calculator'},{slug:'sand-calculator',name:'Sand Calculator'}],faq:[{question:'Can I enter known area?',answer:'Yes, or calculate it from project length and width.'},{question:'Does it calculate pallets?',answer:'Yes when you enter the supplier’s pavers-per-pallet quantity.'},{question:'When is the count rounded?',answer:'Only after the waste allowance is applied to the exact geometric requirement.'}]})},
  'polymeric-sand-calculator': {slug:'polymeric-sand-calculator',...expansionPage({name:'Polymeric Sand Calculator',description:'Estimate repeated-grid joint volume, density-based polymeric sand weight and whole bags.',keywords:['polymeric sand calculator joint width','paver joint sand bag calculator','polymeric sand coverage estimate'],intro:'Model interior paver-joint fill with a repeated paver-plus-joint module, editable depth, density and allowance.',formula:'Joint plan area per module = repeated module area − paver face area; volume × density gives base mass before allowance.',interpretation:'Base mass, allowance-adjusted mass, exact bag equivalent and whole bags are reported separately.',limitations:['The repeating-grid approximation does not model edge joints, cuts or irregular patterns.','Manufacturer coverage varies with paver geometry, joint profile, compaction and product formulation.','Use the product data sheet whenever it provides a tested coverage table.'],relatedTools:[{slug:'paver-calculator',name:'Paver Calculator'},{slug:'sand-calculator',name:'Sand Calculator'}],faq:[{question:'Are crossing joints counted twice?',answer:'No. Joint area is the non-overlapping remainder of each repeated module.'},{question:'Can density be changed?',answer:'Yes. Override the planning density with product information.'},{question:'Is this a manufacturer coverage guarantee?',answer:'No. Product-specific coverage should control purchasing.'}]})},
  'mulch-calculator': {slug:'mulch-calculator',...expansionPage({name:'Mulch Calculator',description:'Calculate mulch cubic feet, cubic yards, liters and bag count for rectangular, circular or known-area beds.',keywords:['mulch cubic yard calculator','mulch depth bag calculator','circular mulch bed calculator'],intro:'Convert bed area and installed depth into bulk or bagged mulch quantities.',formula:'Volume = area × depth in feet; cubic yards = cubic feet ÷ 27.',interpretation:'For 100 square feet at 3 inches, the result is 25 ft³ or about 0.926 yd³.',limitations:['Settling, irregular grades and desired replenishment depth can change actual need.','Bag volumes should come from the product label.'],relatedTools:[{slug:'topsoil-calculator',name:'Topsoil Calculator'},{slug:'land-area-converter',name:'Land Area Converter'}],faq:[{question:'How much mulch for 100 ft² at 3 inches?',answer:'25 cubic feet, about 0.926 cubic yards.'},{question:'Can I calculate a circle?',answer:'Yes. In circle mode, the entered length is treated as diameter.'},{question:'Can I change bag size?',answer:'Yes. Enter bag volume in cubic feet.'}]})},
  'topsoil-calculator': {slug:'topsoil-calculator',...expansionPage({name:'Topsoil Calculator',description:'Calculate topsoil cubic feet, cubic yards, cubic meters and editable-density tonnage from area and depth.',keywords:['topsoil cubic yard calculator','soil depth volume calculator','topsoil tons calculator density'],intro:'Estimate loose topsoil volume and an optional weight range starting from measured coverage.',formula:'Volume = area × depth in feet; estimated short tons = cubic feet × entered lb/ft³ ÷ 2,000.',interpretation:'For 100 square feet at 3 inches, volume is 25 ft³ or about 0.926 yd³ before settlement.',limitations:['Moisture, composition, screening and compaction materially change density and delivered coverage.','Tonnage is only as reliable as the entered density.'],relatedTools:[{slug:'mulch-calculator',name:'Mulch Calculator'},{slug:'excavation-calculator',name:'Excavation Calculator'}],faq:[{question:'How much topsoil for 100 ft² at 3 inches?',answer:'25 cubic feet, about 0.926 cubic yards.'},{question:'Why is density editable?',answer:'Wet, dry, sandy and organic soils have different bulk weights.'},{question:'Does volume include compaction?',answer:'No. Add a project-specific settlement allowance if needed.'}]})},
  'fertilizer-calculator': {
    slug: 'fertilizer-calculator',
    name: 'Fertilizer Calculator – How Much Fertilizer to Apply',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate fertilizer needed for a measured area from a nutrient rate and the N-P-K percentages on your fertilizer label.',
    longTailKeywords: ['fertilizer calculator', 'lawn fertilizer calculator', 'yard fertilizer calculator', 'fertilizer application rate calculator', 'fertilizer calculator formula', 'fertilizer calculator for lawn', 'fertilizer calculator per acre', 'fertilizer calculator per square foot', 'how much fertilizer do i need calculator'],
    intro: [
      'Work out how much fertilizer product you need for a lawn, garden bed, or field. Enter the measured area, a nutrient rate from your soil test or product instructions, and the N-P-K percentages printed on the bag.',
      'The result shows product weight for the full area, the N-P-K nutrients that amount supplies, and optional bag coverage. The calculator does not select or recommend an application rate.',
    ],
    formula: [
      { title: 'Find product weight for one rate area', body: 'Product needed = nutrient rate ÷ (selected nutrient percentage ÷ 100). For example, if the entered rate is 1 lb nitrogen per 1,000 sq ft and the label lists 26% nitrogen, the calculation is 1 ÷ 0.26 = about 3.85 lb of product per 1,000 sq ft.' },
      { title: 'Scale it to the full area', body: 'Total product = product needed for the rate area × (measured area ÷ rate area). The tool converts acres to 43,560 square feet and lets you enter a rate per acre or per 1,000 square feet.' },
      { title: 'Show the other label nutrients', body: 'For each label nutrient, product weight × label percentage ÷ 100 gives the nutrient amount supplied. The label order is nitrogen (N), phosphate (P₂O₅), then potash (K₂O).' },
    ],
    steps: ['Measure the area to treat and choose square feet or acres.', 'Enter the nutrient rate provided by your soil test or product instructions, and choose whether that rate is per 1,000 square feet or per acre.', 'Select the nutrient the rate refers to: N, P₂O₅, or K₂O.', 'Copy the three percentages from the product label into the N-P-K fields.', 'Optionally enter the bag weight to estimate coverage and whole bags to purchase.'],
    interpretation: ['Product weight is the calculated amount for the whole area. Product per rate area makes it easier to check against the same rate basis entered above.', 'N, P₂O₅, and K₂O totals show what the calculated product amount supplies according to the label percentages; they are not three extra amounts to add to the product.', 'A whole-bag count rounds upward for purchasing. It does not mean leftover fertilizer should be applied.'],
    limitations: ['This calculator works from the rate you enter. It does not decide how much nutrient a lawn, garden, or crop needs. Follow the soil-test recommendation, fertilizer label, and local requirements.', 'The label percentages are treated as weight percentages and the result is product weight in pounds. Do not use it to convert liquid fertilizer ounces, gallons, or volume-based concentrations.', 'The result is a mathematical estimate. Uneven spreading, overlap, missed areas, product handling, and equipment calibration can change the amount actually applied.', 'The second and third N-P-K values are fertilizer-label conventions for phosphate (P₂O₅) and potash (K₂O), not elemental phosphorus and potassium percentages.'],
    faqs: [
      { question: 'How much fertilizer do I need for my lawn?', answer: 'Enter your lawn area, a nutrient rate from a soil test or product instructions, the nutrient that rate refers to, and the N-P-K label percentages. The calculator returns the matching product weight for the full area.' },
      { question: 'How do I calculate fertilizer per 1,000 square feet?', answer: 'Divide the nutrient rate by the fertilizer label percentage written as a decimal. For a hypothetical 1 lb nitrogen rate and 26% nitrogen product, 1 ÷ 0.26 = about 3.85 lb product per 1,000 square feet.' },
      { question: 'What do the three fertilizer numbers mean?', answer: 'They list the guaranteed percentages of nitrogen (N), phosphate (P₂O₅), and potash (K₂O), in that order. Enter them exactly as shown on the product label.' },
      { question: 'Can I enter my area in acres?', answer: 'Yes. Choose acres for area. You can enter the nutrient rate per acre or per 1,000 square feet independently.' },
      { question: 'Does the calculator recommend a fertilizer rate?', answer: 'No. Use the rate from your soil-test report or product instructions. The tool only converts that rate and the label percentages into product weight.' },
      { question: 'Can I use this for liquid fertilizer?', answer: 'Not for volume conversions. This calculator returns pounds of product using label percentages by weight; liquid ounces or gallons may require concentration and density information.' },
    ],
    relatedTools: [
      { slug: 'mulch-calculator', name: 'Mulch Calculator' },
      { slug: 'topsoil-calculator', name: 'Topsoil Calculator' },
      { slug: 'land-area-converter', name: 'Land Area Converter' },
      { slug: 'square-footage-calculator', name: 'Square Footage Calculator' },
    ],
    relatedGuides: ['how-to-calculate-fertilizer-for-a-lawn', 'fertilizer-npk-numbers-explained', 'how-to-calculate-fertilizer-from-a-soil-test'],
  },
  'osha-portable-toilet-calculator': {
    slug: 'osha-portable-toilet-calculator',
    name: 'OSHA Portable Toilet Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Estimate how many toilet facilities a construction jobsite needs for a given number of workers using OSHA construction sanitation requirements.',
    longTailKeywords: [
      'portable toilet calculator',
      'portable restroom calculator',
      'construction portable toilet calculator',
      'osha portable toilet calculator',
      'osha toilet requirements construction',
      'portable toilets per worker',
      'construction toilet ratio',
      'osha porta potty requirements',
      'how many portable toilets construction site',
    ],
    intro: [
      'Enter the number of workers on a construction site to estimate the OSHA minimum toilet-facility requirement.',
      'Portable toilet units can be configured differently, so the result explains the OSHA fixture requirement separately from the number of rental units you may need.',
    ],
    formula: [
      {
        title: '20 or fewer employees',
        body: 'Table D-1 specifies at least one toilet facility.',
      },
      {
        title: 'More than 20 and fewer than 200',
        body: 'One toilet seat and one urinal per 40 workers, rounded up to the next whole fixture set.',
      },
      {
        title: '200 or more',
        body: 'One toilet seat and one urinal per 50 workers, rounded up to the next whole fixture set.',
      },
    ],
    steps: [
      'Enter the number of employees on the construction jobsite.',
      'Review the applicable OSHA workforce range.',
      'Review the calculated toilet-seat, urinal or facility minimum.',
      'Confirm actual portable-unit configuration and any state or local requirements before ordering.',
    ],
    interpretation: [
      'The result is based on OSHA construction sanitation thresholds rather than event attendance ratios.',
      'For larger workforces, the regulatory table describes toilet seats and urinals rather than a universal portable-unit design.',
      'Sanitary condition and reasonable access remain important even when the numerical minimum is satisfied.',
    ],
    limitations: [
      'State-plan OSHA requirements, local sanitation rules, contracts and project requirements can be more stringent.',
      'The calculator does not determine servicing frequency, accessibility requirements or event sanitation quantities.',
      'Actual portable toilets differ in whether they contain a seat, urinal or both.',
    ],
    faqs: [
      {
        question: 'How many toilets are required for 20 construction workers?',
        answer: 'OSHA Table D-1 specifies at least one toilet facility for 20 or fewer employees.',
      },
      {
        question: 'What ratio applies below 200 workers after the first threshold?',
        answer: 'The table specifies one toilet seat and one urinal per 40 workers.',
      },
      {
        question: 'What ratio applies for 200 or more workers?',
        answer: 'The table specifies one toilet seat and one urinal per 50 workers.',
      },
    ],
    relatedTools: [
      { slug: 'construction-estimate-builder', name: 'Construction Estimate Builder' },
      { slug: 'dumpster-weight-calculator', name: 'Dumpster Weight Calculator' },
    ],
    relatedGuides: [],
  },

  'egress-window-code-checker': {
    slug: 'egress-window-code-checker',
    name: 'Egress Window Code Checker',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Check net clear opening width, height, area and sill height against commonly referenced IRC emergency escape and rescue opening dimensions.',
    longTailKeywords: [
      'egress window calculator',
      'egress window code checker',
      'egress window size calculator',
      'basement egress window requirements',
      'legal bedroom egress window',
      'egress window clear opening calculator',
    ],
    intro: [
      'Enter actual net clear opening dimensions to check the measurable emergency escape and rescue opening thresholds commonly referenced from IRC R310.',
      'The result is a dimension check only and does not determine whether a room legally qualifies as a bedroom.',
    ],
    formula: [
      {
        title: 'Net clear area',
        body: 'Clear width in inches × clear height in inches ÷ 144 = clear opening area in square feet.',
      },
      {
        title: 'Standard area threshold',
        body: 'The referenced minimum net clear opening is 5.7 square feet.',
      },
      {
        title: 'Grade-floor exception',
        body: 'A qualifying grade-floor emergency escape and rescue opening can use a 5.0-square-foot minimum.',
      },
    ],
    steps: [
      'Measure the actual net clear opening width and height produced by normal window operation.',
      'Measure the height from the floor to the bottom of the clear opening.',
      'Choose the grade-floor exception only if it applies under the locally adopted code.',
      'Review each width, height, area and sill-height criterion separately.',
    ],
    interpretation: [
      'The referenced minimum clear width is 20 inches.',
      'The referenced minimum clear height is 24 inches.',
      'The referenced maximum height from the floor to the bottom of the clear opening is 44 inches.',
      'Minimum width and minimum height do not replace the separate minimum clear-area requirement.',
    ],
    limitations: [
      'Building-code edition and local amendments vary by jurisdiction.',
      'The checker does not evaluate window wells, ladders, operational constraints, decks, smoke alarms, ventilation, ceiling height or permitting.',
      'Passing these selected measurements does not itself establish legal-bedroom status.',
    ],
    faqs: [
      {
        question: 'Is a 20 by 24 inch opening enough?',
        answer: 'No. Although those dimensions satisfy the individual minimum width and height, they produce only about 3.33 square feet of clear area.',
      },
      {
        question: 'What is the standard clear opening area?',
        answer: 'The referenced IRC minimum is generally 5.7 square feet, with a 5.0-square-foot grade-floor exception when applicable.',
      },
      {
        question: 'Does passing this checker make the room a legal bedroom?',
        answer: 'No. Other local building-code and permitting requirements can apply.',
      },
    ],
    relatedTools: [
      { slug: 'ladder-safe-reach-calculator', name: 'Ladder Safe Reach Calculator' },
      { slug: 'paint-calculator', name: 'Paint Calculator' },
    ],
    relatedGuides: [],
  },

  'air-compressor-cfm-calculator': {
    slug: 'air-compressor-cfm-calculator',
    name: 'Air Compressor CFM & Tank Runtime Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Compare compressor SCFM with air tool demand, usage duty cycle and tank capacity to estimate whether a compressor can keep up with an impact wrench, nailer, grinder, sander or spray gun.',
    longTailKeywords: [
      'air compressor cfm calculator',
      'air tool cfm calculator',
      'compressor size calculator',
      'compressor tank runtime calculator',
      'air compressor duty cycle calculator',
      'what size compressor for impact wrench',
      'what size compressor for spray gun',
      'what size compressor for nail gun',
      'how much cfm do i need',
      'how many cfm to run air tools',
      'air compressor scfm calculator',
      'what cfm compressor do i need',
    ],
    intro: [
      'Compare the airflow produced by an air compressor with the average air demand of a pneumatic tool.',
      'The calculator accounts for tool usage percentage and provides a planning estimate for compressor capacity, airflow margin and tank-runtime behavior.',
    ],
    formula: [
      {
        title: 'Average tool demand',
        body: 'Rated tool CFM × estimated percentage of time the tool is actively consuming air.',
      },
      {
        title: 'Airflow margin',
        body: 'Compressor SCFM minus estimated average tool CFM.',
      },
      {
        title: 'Recommended planning capacity',
        body: 'Estimated average demand plus a modest airflow margin for planning purposes.',
      },
    ],
    steps: [
      'Enter compressor SCFM, pressure rating and tank size.',
      'Choose a common air tool or enter the actual CFM and PSI from its manufacturer specification.',
      'Estimate how much of each minute the tool is actively consuming air.',
      'Review average demand, compressor margin, capacity status and the approximate tank-runtime indication.',
    ],
    interpretation: [
      'A comfortable result means estimated average tool demand is materially below the entered compressor output.',
      'A borderline result means real-world hose, fitting, regulator and pressure losses may become important.',
      'If estimated demand exceeds compressor output, stored tank air can support temporary operation but cannot permanently replace insufficient pump capacity.',
    ],
    limitations: [
      'Compressor SCFM should be compared at or near the pressure required by the tool whenever possible.',
      'Actual airflow varies with compressor condition, altitude, temperature, hose length and diameter, fittings, regulators, leakage and manufacturer test methods.',
      'Tank-runtime output is a simplified planning estimate and does not reproduce the exact pressure-switch or pump-recovery behavior of every compressor.',
    ],
    faqs: [
      {
        question: 'How much CFM does my air compressor need?',
        answer: 'The compressor should supply at least the average airflow required by the tool at the required pressure, with additional margin where practical.',
      },
      {
        question: 'Does a bigger air tank increase CFM?',
        answer: 'No. A larger tank stores more compressed air but does not increase the compressor pump output.',
      },
      {
        question: 'Why does tool duty cycle matter?',
        answer: 'Intermittently used tools can have lower average air consumption than tools that run continuously.',
      },
    ],
    relatedTools: [
      { slug: 'voltage-drop-calculator', name: 'Voltage Drop Calculator' },
      { slug: 'wire-size-calculator', name: 'Wire Size Calculator' },
    ],
    relatedGuides: [],
  },

  'ladder-safe-reach-calculator': {
    slug: 'ladder-safe-reach-calculator',
    name: 'Ladder Safe Reach & 4:1 Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Estimate extension ladder base distance, setup angle, vertical height and approximate reach using 4:1 ladder geometry.',
    longTailKeywords: [
      'ladder height calculator',
      'ladder reach calculator',
      'ladder 4 to 1 calculator',
      'ladder angle calculator',
      'ladder distance from wall calculator',
      'extension ladder length calculator',
      'ladder working height calculator',
    ],
    intro: [
      'Estimate the geometry of an extension or leaning ladder using the commonly referenced 4:1 setup relationship.',
      'The calculator separates ladder length, vertical height, horizontal base distance and approximate reach so they are not confused with one another.',
    ],
    formula: [
      {
        title: '4:1 relationship',
        body: 'Horizontal base distance is approximately one unit for every four units of vertical rise.',
      },
      {
        title: 'Vertical height',
        body: 'The ladder, wall and ground form a right triangle, so the ladder length is the hypotenuse rather than the vertical height.',
      },
      {
        title: 'Approximate reach',
        body: 'A planning estimate combines usable ladder height with entered user height; permitted standing levels must still come from the ladder manufacturer.',
      },
    ],
    steps: [
      'Select the ladder type.',
      'Enter ladder length and user height.',
      'Review the calculated base distance, vertical height, setup angle and approximate reach.',
      'Use manufacturer instructions and applicable safety requirements before physically positioning or climbing a ladder.',
    ],
    interpretation: [
      'For a leaning ladder, the 4:1 geometry produces an angle of roughly 76 degrees relative to the ground.',
      'Ladder length is greater than vertical height because part of the ladder length spans the horizontal base distance.',
      'Approximate reach is not a permitted standing-height recommendation.',
    ],
    limitations: [
      'This calculator does not assess ground condition, ladder rating, electrical hazards, tie-off requirements, ladder damage, user capability or workplace conditions.',
      'Manufacturer labels and applicable safety rules determine permitted setup and standing levels.',
      'Step-ladder reach values are approximate planning figures because designs and permitted standing levels vary.',
    ],
    faqs: [
      {
        question: 'What is the 4:1 ladder rule?',
        answer: 'It describes a setup relationship of about one unit of horizontal distance for every four units of vertical rise.',
      },
      {
        question: 'What angle does the 4:1 ladder rule create?',
        answer: 'The geometry produces an angle of approximately 76 degrees relative to the ground.',
      },
      {
        question: 'Is ladder length the same as working height?',
        answer: 'No. Ladder length, vertical height, permitted standing height and user reach are different measurements.',
      },
    ],
    relatedTools: [
      { slug: 'roof-area-calculator', name: 'Roof Area Calculator' },
      { slug: 'paint-calculator', name: 'Paint Calculator' },
    ],
    relatedGuides: [],
  },

  'saw-kerf-calculator': {
    slug: 'saw-kerf-calculator',
    name: 'Saw Kerf & Board Width Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate how many equal-width pieces fit in a board after accounting for saw blade kerf, material removed by cuts and the remaining offcut.',
    longTailKeywords: [
      'saw kerf calculator',
      'kerf calculator',
      'board width calculator',
      'saw blade kerf calculator',
      'wood cutting calculator',
      'rip cut calculator',
      'board cutting calculator',
      'how many boards can i cut',
    ],
    intro: [
      'Calculate the maximum number of equal-width strips or boards that can be cut from a known stock width.',
      'The calculator accounts for saw kerf so the material removed by the blade is not accidentally treated as usable finished width.',
    ],
    formula: [
      {
        title: 'Material required',
        body: 'Number of pieces × finished piece width + number of cuts × saw kerf.',
      },
      {
        title: 'Kerf loss',
        body: 'Number of cuts × entered kerf width.',
      },
      {
        title: 'Offcut',
        body: 'Stock width minus finished-piece width and calculated kerf loss.',
      },
    ],
    steps: [
      'Measure the usable width of the stock.',
      'Enter the desired finished width of each equal piece.',
      'Enter the actual or nominal kerf width of the saw blade.',
      'Review piece count, kerf loss, material utilization and remaining offcut.',
    ],
    interpretation: [
      'Kerf becomes increasingly important as the number of cuts increases.',
      'The calculator reports only complete equal-width pieces that fit inside the entered stock width.',
      'Remaining offcut may still be reusable depending on the project.',
    ],
    limitations: [
      'Actual kerf can differ from blade-body thickness because of tooth geometry, blade runout, wear and machine setup.',
      'The calculation does not automatically reserve stock for jointing, edge trimming, sanding, defects or finishing tolerance.',
      'Use actual measurements and verify a cut plan before processing valuable material.',
    ],
    faqs: [
      {
        question: 'What is saw kerf?',
        answer: 'Kerf is the width of material removed by a saw blade during a cut.',
      },
      {
        question: 'Is blade thickness the same as kerf?',
        answer: 'Not always. Tooth geometry and blade behavior can make the actual cut wider than the blade body.',
      },
      {
        question: 'Why should kerf be included in a cut list?',
        answer: 'Every cut removes material, so ignoring kerf can make the planned finished widths exceed the available stock.',
      },
    ],
    relatedTools: [
      { slug: 'board-foot-calculator', name: 'Board Foot Calculator' },
      { slug: 'construction-estimate-builder', name: 'Construction Estimate Builder' },
    ],
    relatedGuides: [],
  },

  'dumpster-weight-calculator': {
    slug: 'dumpster-weight-calculator',
    name: 'Dumpster Weight Calculator – Estimate Tonnage & Overage Fees',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Estimate dumpster debris weight, included tonnage, excess weight and potential overage fees for concrete, drywall, shingles, lumber and mixed construction debris.',
    longTailKeywords: [
      'dumpster weight calculator',
      'dumpster tonnage calculator',
      'dumpster overage fee calculator',
      'construction debris weight calculator',
      'dumpster weight limit',
      'dumpster weight allowance',
      'concrete dumpster weight',
      'drywall dumpster weight',
      'roofing shingles dumpster weight',
    ],
    intro: [
      'Estimate the combined weight of multiple construction and household debris materials, then compare the result with the tonnage included in a dumpster rental.',
      'The calculator runs locally in the browser and uses editable rental terms plus clearly stated planning factors for debris weight.',
    ],
    formula: [
      { title: 'Debris weight', body: 'Quantity × estimated pounds per selected material unit, with an optional condition adjustment for moisture-sensitive estimates.' },
      { title: 'Overage weight', body: 'Maximum of zero or estimated tons minus the included weight allowance.' },
      { title: 'Potential fee', body: 'Estimated overage tons × the user-entered fee per ton.' },
    ],
    steps: [
      'Choose a dumpster size for volume context and enter the included tonnage and contractual overage rate.',
      'Add each debris material with its quantity and a supported unit.',
      'Select an estimated material condition and review weight, allowance, overage, fee, and known-volume guidance.',
    ],
    interpretation: [
      'The weight result is an estimate in pounds and US short tons, not a scale measurement.',
      'Dumpster volume and included weight are separate constraints; dense debris can exceed tonnage before the container is full.',
      'Potential fees use the entered rate and do not include taxes, minimum charges, prohibited-load fees, or other contract terms.',
    ],
    limitations: [
      'Material factors are rounded planning assumptions and vary with composition, moisture, thickness, compaction, contamination, and demolition method.',
      'Area-based drywall and shingle factors assume typical thickness or a single layer; verify unusual assemblies separately.',
      'The rental company scale ticket, contract, fill rules, and local hauling requirements determine actual charges and permitted loads.',
    ],
    faqs: [
      { question: 'Can a dumpster be overweight without being full?', answer: 'Yes. Dense materials can reach a tonnage allowance while using only part of the dumpster volume.' },
      { question: 'How is estimated overage calculated?', answer: 'Estimated tons above the included allowance are multiplied by the fee per ton you enter.' },
      { question: 'Are the material weights exact?', answer: 'No. They are rounded planning assumptions; actual scale weight can differ substantially.' },
    ],
    relatedTools: [
      { slug: 'concrete-calculator', name: 'Concrete Calculator' },
      { slug: 'gravel-calculator', name: 'Gravel Calculator' },
      { slug: 'roof-area-calculator', name: 'Roof Area Calculator' },
      { slug: 'excavation-calculator', name: 'Excavation Calculator' },
    ],
    relatedGuides: [],
  },

  'construction-estimate-builder': {
    slug: 'construction-estimate-builder',
    name: 'Construction Estimate Builder',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Build an itemized construction cost estimate from materials, labor, equipment, subcontractors, overhead, contingency, markup and tax, then download it as PDF or JPG.',
    longTailKeywords: [
      'construction estimate template',
      'construction estimate builder',
      'construction estimate generator',
      'free construction estimate template',
      'construction cost estimate template',
      'itemized construction estimate',
      'construction bid calculator',
      'bid calculator construction',
      'construction estimate calculator'
    ],
    intro: [
      'Create a construction estimate or preliminary bid by entering project-specific material, labor, equipment and subcontractor line items instead of relying on generic cost-per-square-foot assumptions.',
      'All project details, customer information, quantities, rates, and estimate data are processed locally in the browser.'
    ],
    formula: [
      {
        title: 'Line-item direct cost',
        body: 'Each line amount equals quantity × unit cost. Direct cost is the sum of all materials, labor, equipment, subcontractor, and other line items.'
      },
      {
        title: 'Overhead and contingency',
        body: 'Overhead is applied to direct cost. Contingency is applied to direct cost plus overhead.'
      },
      {
        title: 'Markup and total',
        body: 'Markup is applied after direct cost, overhead, and contingency. Any entered discount is deducted before tax, then tax is applied to the remaining taxable amount.'
      }
    ],
    steps: [
      'Enter the project and estimate details.',
      'Add as many materials, labor, equipment, subcontractor, or other line items as required.',
      'Enter quantity and unit cost for each line item.',
      'Set overhead, contingency, markup, tax, and optional discount assumptions.',
      'Review the category breakdown and final estimate total.',
      'Download the estimate as JPG or PDF, or print it directly from the browser.'
    ],
    interpretation: [
      'The estimate is driven entirely by the rates and quantities you enter, so it can be used in different countries and currencies.',
      'Overhead, contingency, markup, and tax are shown separately so users can understand how each assumption affects the final amount.',
      'The exported estimate includes a QR code and Navorika link for convenient access to the tool again.'
    ],
    limitations: [
      'Navorika does not supply market prices, labor rates, tax rates, or contractual terms.',
      'The calculator does not determine project scope, engineering requirements, permits, escalation, financing, exclusions, measurement rules, or procurement risk.',
      'Tax treatment, markup method, overhead allocation, and contingency conventions vary by project and jurisdiction.',
      'The output is a planning estimate and is not a professional quantity survey, bid, contract, valuation, or engineering estimate.'
    ],
    faqs: [
      {
        question: 'Can I use this as a construction estimate template?',
        answer: 'Yes. The tool provides an interactive alternative to a static construction estimate template and lets you add project-specific line items and costs.'
      },
      {
        question: 'Can I add unlimited estimate items?',
        answer: 'You can add multiple materials, labor, equipment, subcontractor, and other line items directly in the browser.'
      },
      {
        question: 'Does Navorika provide construction prices?',
        answer: 'No. Enter your own current supplier, labor, subcontractor, rental, and project-specific rates.'
      },
      {
        question: 'Can I download the estimate?',
        answer: 'Yes. You can export the estimate as a JPG or PDF or print it directly.'
      },
      {
        question: 'Is my project or customer data uploaded?',
        answer: 'No. The estimate runs locally in your browser.'
      }
    ],
    relatedTools: [
      { slug: 'contractor-estimate-generator', name: 'Contractor Estimate Generator' },
      { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' },
      { slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' },
      { slug: 'board-foot-calculator', name: 'Board Foot Calculator' }
    ],
    relatedGuides: ['construction-estimate-quote-guide', 'house-construction-cost-guide'],
  },

  'contractor-estimate-generator': {
    slug: 'contractor-estimate-generator',
    name: 'Contractor Estimate Generator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Create a contractor estimate or construction quote with customer details, line-item pricing, markup, tax, terms and downloadable PDF/JPG output.',
    longTailKeywords: [
      'contractor estimate template',
      'general contractor estimate template',
      'free contractor estimate template',
      'contractor estimate generator',
      'construction quote template',
      'contractor quote generator',
      'construction bid template',
      'contractor bid calculator',
      'construction quote generator'
    ],
    intro: [
      'Contractor Estimate Generator turns project quantities and rates into a customer-facing estimate that can be saved, printed, or shared without requiring a spreadsheet or document template.',
      'Customer, contractor, pricing, and project information remain in the browser and are not sent to Navorika.'
    ],
    formula: [
      {
        title: 'Line items',
        body: 'Each estimate line equals quantity × entered unit cost.'
      },
      {
        title: 'Project additions',
        body: 'Overhead, contingency, and markup are calculated separately from direct line-item cost.'
      },
      {
        title: 'Final estimate',
        body: 'Any discount is deducted from the subtotal before the entered tax percentage is applied.'
      }
    ],
    steps: [
      'Enter the estimate number, project name, customer name, contractor or business name, and project description.',
      'Add each material, labor, equipment, subcontractor, or other item with quantity and unit cost.',
      'Enter applicable overhead, contingency, markup, discount, and tax assumptions.',
      'Add payment terms, exclusions, validity period, or other notes.',
      'Review the estimate and export it as PDF or JPG or print it.'
    ],
    interpretation: [
      'This tool is designed as an interactive alternative to static contractor estimate templates.',
      'The category breakdown helps show how much of the direct estimate comes from materials, labor, equipment, subcontractors, and other costs.',
      'The downloadable document can be used as a draft estimate for further review or customer communication.'
    ],
    limitations: [
      'The generator does not create legally binding contract terms or determine local tax requirements.',
      'It does not verify scope completeness, measurements, prices, labor productivity, specification, code compliance, or profitability.',
      'Users should review the estimate against project drawings, specifications, supplier quotations, contractual requirements, and applicable laws.',
      'The output is not a substitute for professional estimating, quantity surveying, legal, tax, or engineering advice.'
    ],
    faqs: [
      {
        question: 'Can I create a contractor estimate without Excel or Word?',
        answer: 'Yes. You can build the estimate directly in the browser and export the finished result.'
      },
      {
        question: 'Can I include my business and customer name?',
        answer: 'Yes. Contractor mode includes dedicated contractor, customer, project, estimate number, description, and notes fields.'
      },
      {
        question: 'Does the generator calculate markup?',
        answer: 'Yes. Enter your own markup percentage along with overhead, contingency, tax, and optional discount.'
      },
      {
        question: 'Can I save the contractor estimate as PDF?',
        answer: 'Yes. PDF and JPG exports are available, and you can also print the estimate.'
      },
      {
        question: 'Does Navorika save customer information?',
        answer: 'No. The estimate is processed locally in your browser.'
      }
    ],
    relatedTools: [
      { slug: 'construction-estimate-builder', name: 'Construction Estimate Builder' },
      { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' },
      { slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' },
      { slug: 'unit-price-calculator', name: 'Unit Price Calculator' }
    ],
    relatedGuides: ['construction-estimate-quote-guide', 'house-construction-cost-guide'],
  },
  'board-foot-calculator': {
    slug: 'board-foot-calculator',
    name: 'Board Foot Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate lumber board feet from board thickness, width, length and quantity with imperial or metric dimensions and optional material cost.',
    longTailKeywords: ['board foot calculator', 'board feet calculator', 'lumber board foot calculator', 'calculate board feet', 'board foot cost calculator'],
    intro: [
      'Board Foot Calculator converts lumber dimensions and quantity into board feet and can estimate total material cost from an entered price per board foot.',
      'Imperial dimensions use the standard board-foot relationship; metric dimensions are converted through cubic volume.'
    ],
    formula: [
      { title: 'Imperial board feet', body: 'Board feet = thickness in inches × width in inches × length in feet ÷ 12 × quantity.' },
      { title: 'Metric conversion', body: 'Metric dimensions are converted to cubic metres and then converted using one board foot = 0.002359737216 cubic metres.' },
      { title: 'Estimated cost', body: 'Total cost = total board feet × entered price per board foot.' },
    ],
    steps: ['Choose imperial or metric dimensions.', 'Enter lumber thickness, width and length.', 'Enter the number of pieces.', 'Optionally enter a price per board foot.', 'Review board feet per piece, total board feet and estimated cost.'],
    interpretation: ['Board foot is a volume measure commonly used for lumber.', 'A nominal board size may differ from its actual dressed dimensions, so use the dimensions appropriate to the pricing method being used.'],
    limitations: ['Confirm whether a lumber supplier prices from nominal or actual dimensions.', 'Waste, defects, kerf, moisture, surfacing and supplier minimum quantities are not automatically included.', ...planningLimits],
    faqs: [
      { question: 'What is one board foot?', answer: 'One board foot is a lumber volume equal to 144 cubic inches.' },
      { question: 'What is the board foot formula?', answer: 'For thickness and width in inches and length in feet: thickness × width × length ÷ 12.' },
      { question: 'Can I use metric dimensions?', answer: 'Yes. The calculator converts metric lumber volume to board feet.' },
      { question: 'Does it calculate lumber cost?', answer: 'Yes. Enter an optional price per board foot to estimate total cost.' },
    ],
    relatedTools: [
      { slug: 'wallpaper-calculator', name: 'Wallpaper Calculator' },
      { slug: 'flooring-calculator', name: 'Flooring Calculator' },
    ],
    relatedGuides: [],
  },
  'wallpaper-calculator': {
    slug: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Estimate wallpaper rolls required from room perimeter, wall height, openings, wallpaper roll dimensions, and waste allowance.',
    longTailKeywords: ['wallpaper calculator', 'wallpaper rolls calculator', 'how many wallpaper rolls do I need', 'wallpaper coverage calculator'],
    intro: [
      'Wallpaper Calculator estimates room wall area, wallpaper strip requirements, and a recommended number of rolls.',
      'Inputs are processed locally in your browser and are not sent to Navorika.',
    ],
    formula: [
      { title: 'Wall area', body: 'Gross wall area = room perimeter × wall height.' },
      { title: 'Net area', body: 'Net wall area = gross wall area - entered doors and windows area.' },
      { title: 'Strip method', body: 'Required strips are estimated from room perimeter ÷ roll width, while strips per roll are calculated from roll length ÷ wall height.' },
    ],
    steps: ['Choose metres or feet.', 'Enter r…7929 tokens truncated…ulator with system losses'],
    intro: ['Enter average daily electricity use, peak sun hours, panel wattage, and system losses to estimate a starting solar panel count.', 'The result is a planning estimate; roof direction, shading, local weather, utility rules, and installer design can change the final system size.'],
    formula: [{ title: 'Required array', body: 'Daily kWh ÷ peak sun hours ÷ (1 − loss percentage ÷ 100).' }, { title: 'Panel count', body: 'Required array watts ÷ panel watts, rounded upward.' }],
    steps: ['Use representative average daily consumption from utility or monitoring data.', 'Enter location- and orientation-appropriate peak sun hours and a realistic total loss estimate.', 'Choose panel nameplate wattage, then obtain a site-specific professional design.'],
    interpretation: ['Nominal kW is panel nameplate capacity, not continuous output.', 'Annual production assumes every day has the entered average peak sun hours and loss rate.'], limitations: ['Not a quotation, savings forecast, electrical design, structural assessment, or permit document.', 'Does not model monthly weather, shading, azimuth, tilt, temperature, snow, degradation, inverter clipping, battery losses, export limits, downtime, or load timing.', 'Peak sun hours are not daylight hours and must come from credible site-specific solar data.'],
    faqs: [{ question: 'What are peak sun hours?', answer: 'They express daily solar energy as equivalent hours at 1,000 W/m², not the number of daylight hours.' }, { question: 'Why is panel count rounded up?', answer: 'A fractional physical panel cannot be installed.' }, { question: 'Does this size a battery?', answer: 'No.' }, { question: 'Is annual production bankable?', answer: 'No. It is a simplified extrapolation from the entered average assumptions.' }],
    relatedTools: [{ slug: 'steel-weight-calculator', name: 'Steel Weight Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }, { slug: 'water-tank-calculator', name: 'Water Tank Calculator' }], relatedGuides: [],
  },
  'steel-weight-calculator': {
    slug: 'steel-weight-calculator', name: 'Steel Weight Calculator – Bars & Simple Sections', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate steel weight for round, square, rectangular bars, or a simple I-shaped section from dimensions, length, quantity, and density.' ,
    longTailKeywords: ['steel bar weight calculator kg per meter', 'round steel rod weight calculator', 'rectangular steel bar mass calculator', 'square steel bar weight calculator', 'simplified I beam weight calculator'],
    intro: ['This calculator multiplies an ideal cross-sectional area by the entered steel density, total length, and quantity; 7,850 kg/m³ is the default.', 'Round, square, and rectangular options model solid bars. The I-section option uses one thickness for both flanges and the web and treats the entered web height as the clear web height.'],
    formula: [{ title: 'Linear mass', body: 'Cross-sectional area in m² × entered density in kg/m³.' }, { title: 'Total mass', body: 'Linear mass × length per piece × quantity.' }],
    steps: ['Choose the idealized section and enter dimensions in millimetres.', 'Enter length per piece in metres and the number of identical pieces.', 'Use manufacturer or mill tables for procurement and structural work.'],
    interpretation: ['Results are theoretical masses for exact geometric dimensions.', '“Tons” means metric tonnes of 1,000 kg.'], limitations: ['Does not model dimensional tolerance, rounded corners, fillets, taper, holes, coatings, corrosion, or fabrication.', 'The I-section is simplified and is not a substitute for a standardized profile table.', 'Density varies by alloy; do not use this estimator for structural design, lifting plans, transport limits, or certification.'],
    faqs: [{ question: 'What steel density is used?', answer: 'The field defaults to 7,850 kg/m³ and can be replaced with the applicable alloy value.' }, { question: 'Does the I-section match catalog beams?', answer: 'Not necessarily; it is simplified ideal geometry.' }, { question: 'Is length entered per piece?', answer: 'Yes. Total length equals entered length multiplied by quantity.' }, { question: 'Should I order from this result?', answer: 'Verify actual section mass and tolerances in supplier data.' }],
    relatedTools: [{ slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: [],
  },
  'flooring-calculator': {
    slug: 'flooring-calculator', name: 'Flooring Calculator – Square Feet, Material & Cost', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Calculate floor area in square feet, how much flooring to order with waste, and estimated material and labor cost using your own rates.',
    longTailKeywords: ['flooring calculator', 'flooring square foot calculator', 'sq foot calculator flooring', 'how much flooring do i need', 'flooring cost calculator per square foot', 'flooring material calculator', 'room flooring square feet calculator', 'laminate flooring cost calculator', 'hardwood flooring calculator'],
    intro: ['The flooring calculator converts room dimensions to square feet, adds the selected material waste percentage, and applies editable US-dollar rates.', 'Material cost uses the enlarged order area; labor cost uses the measured floor area rather than charging labor on unused waste.'],
    formula: [{ title: 'Order area', body: 'Room square feet × (1 + waste percentage ÷ 100).' }, { title: 'Estimated cost', body: 'Order area × material rate + measured area × labor rate.' }],
    steps: ['Measure the room length and width, then choose feet or meters.', 'Enter your flooring price and labor price in US dollars per square foot.', 'Choose a waste allowance and compare the estimate with local store or installer quotes.'],
    interpretation: ['Material presets only prefill editable example rates and are not market-price data.', 'The result excludes taxes and project items not represented by the two entered rates.'], limitations: ['Assumes one rectangular area and does not subtract permanent obstructions.', 'Excludes underlayment, trim, transitions, demolition, subfloor repair, delivery, taxes, and minimum charges.', 'Pattern, board direction, room geometry, and installer requirements can change waste.'],
    faqs: [{ question: 'Why is labor not charged on the waste area?', answer: 'Waste is extra ordered material; the calculator applies labor to the measured installation area.' }, { question: 'Are the preset prices current?', answer: 'No. They are editable examples.' }, { question: 'What currency is used?', answer: 'The displayed cost is formatted in US dollars.' }, { question: 'Can it calculate several rooms?', answer: 'Calculate each rectangular area separately and combine verified totals.' }],
    relatedTools: [{ slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' }, { slug: 'tile-calculator', name: 'Tile Calculator' }, { slug: 'paint-calculator', name: 'Paint Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: ['flooring-calculation-guide', 'house-construction-cost-guide'],
  },
  'paint-calculator': {
    slug: 'paint-calculator', name: 'Room Wall and Ceiling Paint Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate paint litres for four rectangular room walls, optional ceiling, wall openings, coats, product coverage, waste allowance and can size.',
    longTailKeywords: ['room paint calculator walls and ceiling', 'paint liters needed calculator', 'paint coverage square meters per liter', 'two coat paint quantity calculator', 'interior room paint estimate with waste'],
    intro: ['The paint calculator totals four wall faces, subtracts entered wall openings, and optionally adds the ceiling before applying coats and product coverage.', 'It adds a waste allowance and rounds upward using the entered can size.'],
    formula: [{ title: 'Surface area', body: 'Gross wall area − entered wall openings + optional ceiling area.' }, { title: 'Paint volume', body: 'Net area × coats ÷ coverage × (1 + waste percentage ÷ 100).' }, { title: 'Cans', body: 'Allowance-adjusted litres ÷ entered can size, rounded upward.' }],
    steps: ['Measure the room and choose metres or feet.', 'Enter the number of coats and the exact product coverage in m²/L.', 'Set a waste allowance, then reconcile the result with openings and available pack sizes.'],
    interpretation: ['Wall openings are deducted from gross wall area and the ceiling is independently optional.', 'Coverage varies with paint, substrate, preparation, application method, and colour change.'], limitations: ['Assumes a rectangular room with uniform height.', 'Does not separately model trim, floors, feature walls, primer, texture, absorption, or different products.', 'Use actual available can sizes and manufacturer coverage.'],
    faqs: [{ question: 'Does the area include the ceiling?', answer: 'Only when the Include ceiling control is selected.' }, { question: 'Can doors and windows be deducted?', answer: 'Yes. Enter their combined wall opening area.' }, { question: 'Where should coverage come from?', answer: 'Use the specific coating manufacturer’s data for the surface and method.' }, { question: 'Is primer included?', answer: 'No.' }],
    relatedTools: [{ slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' }, { slug: 'flooring-calculator', name: 'Flooring Calculator' }, { slug: 'tile-calculator', name: 'Tile Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: [],
  },
  'land-area-converter': {
    slug: 'land-area-converter', name: 'Land Area Converter for Acres, Hectares and Square Units', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Convert land area between square feet, square metres, square yards, acres, and hectares using fixed international unit relationships.',
    longTailKeywords: ['land area converter acres to square feet', 'hectares to square meters converter', 'square yards to acres calculator', 'acre hectare conversion calculator', 'land measurement unit converter'],
    intro: ['The land area converter normalizes the entered value to square feet and then converts it to the selected target unit.', 'It supports five common international area units and shows the square-foot equivalent as a cross-check.'],
    formula: [{ title: 'Normalize', body: 'Entered area × source-unit square-foot factor.' }, { title: 'Convert', body: 'Square-foot value ÷ target-unit square-foot factor.' }],
    steps: ['Enter a non-negative area value.', 'Choose the source and destination units.', 'Use the converted value for unit comparison, retaining appropriate measurement precision.'],
    interpretation: ['The underlying relationships are fixed; displayed output is rounded to at most four decimal places.', 'The converter changes units only and does not determine parcel area from boundaries.'], limitations: ['Results depend on the accuracy of the entered land area.', 'It does not account for survey geometry, boundary disputes, local land-unit variants, or legal records.', 'Use a licensed surveyor and authoritative documents for property transactions.'],
    faqs: [{ question: 'How many square feet are in an acre?', answer: 'One international acre equals exactly 43,560 square feet.' }, { question: 'How many square metres are in a hectare?', answer: 'One hectare equals exactly 10,000 square metres.' }, { question: 'Can this calculate an irregular plot?', answer: 'No. It converts an area that has already been measured.' }, { question: 'Why is the display rounded?', answer: 'The interface limits decimals for readability; avoid treating displayed precision as survey accuracy.' }],
    relatedTools: [{ slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'asphalt-calculator', name: 'Asphalt Calculator' }], relatedGuides: [],
  },
  'water-tank-calculator': {
    slug: 'water-tank-calculator', name: 'Water Tank Capacity Calculator – Liters, Gallons & Dimensions', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Calculate water tank capacity in liters, US gallons and cubic meters from rectangular, cylindrical or spherical tank dimensions.' ,
    longTailKeywords: ['water tank calculator', 'water tank capacity calculator', 'tank volume calculator', 'water storage tank calculator', 'water tank capacity calculator liters', 'rectangular tank volume calculator', 'cylindrical water tank capacity calculator', 'tank gallons calculator'],
    intro: ['Enter your tank shape and internal dimensions to calculate theoretical water capacity in liters, US gallons and cubic meters.', 'It reports theoretical internal volume in cubic metres, litres, and US liquid gallons.'],
    formula: [{ title: 'Rectangular tank', body: 'Length × width × height.' }, { title: 'Cylinder', body: 'π × (diameter ÷ 2)² × height.' }, { title: 'Sphere', body: '4 ÷ 3 × π × radius³.' }],
    steps: ['Choose the idealized tank shape and input unit.', 'Enter internal dimensions rather than nominal external dimensions.', 'Compare theoretical capacity with manufacturer-rated usable capacity.'],
    interpretation: ['One cubic metre is 1,000 litres; litres are converted to US liquid gallons.', 'Real usable capacity is normally below ideal geometric capacity.'], limitations: ['Assumes a perfect rectangular prism, right circular cylinder, or sphere.', 'Does not subtract wall thickness, fittings, dead volume, freeboard, sediment space, or operating reserves.', 'Not a structural, pressure-vessel, plumbing, or potable-water design tool.'],
    faqs: [{ question: 'Are the gallons US or imperial?', answer: 'The result uses US liquid gallons.' }, { question: 'Should I use internal dimensions?', answer: 'Yes, if you want liquid capacity.' }, { question: 'Is the result usable capacity?', answer: 'No. It is ideal geometric capacity.' }, { question: 'Can it calculate a horizontal cylinder?', answer: 'Only total capacity of a complete cylinder, not partial fill depth.' }],
    relatedTools: [{ slug: 'land-area-converter', name: 'Land Area Converter' }, { slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }], relatedGuides: ['water-tank-size-capacity-guide'],
  },
  'sand-calculator': {
    slug: 'sand-calculator', name: 'Sand Volume, Weight, Bag and Truck Estimate', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate measured and allowance-adjusted sand volume and weight with editable density, bag mass and truck payload.',
    longTailKeywords: ['sand volume weight calculator', 'cubic meter sand calculator', 'sand quantity from length width depth', 'sand density kg per cubic meter calculator', 'sand bags and truck load estimate'],
    intro: ['The sand calculator converts entered dimensions to metres, calculates rectangular measured volume, then applies waste allowance and bulk density in sequence.', 'Bag mass and truck payload are editable; exact equivalents and whole purchasing quantities are separate.'],
    formula: [{ title: 'Measured volume', body: 'Length × width × depth in metres.' }, { title: 'Adjusted volume', body: 'Measured volume × (1 + waste percentage ÷ 100).' }, { title: 'Weight', body: 'Adjusted volume in m³ × entered density in kg/m³.' }],
    steps: ['Measure the filled rectangular dimensions and choose metres or feet.', 'Enter a representative loose or compacted bulk density for the actual sand.', 'Review volume and weight, then confirm delivery units with the supplier.'],
    interpretation: ['Moisture, grading, compaction, and voids can materially change bulk density.', 'Whole bag and load counts use the entered supplier mass and lawful payload.'], limitations: [...planningLimits, 'No bulking, compaction, moisture or irregular-shape factor is modeled automatically.', 'Entered bag mass and truck payload must match local supply and transport limits.'],
    faqs: [{ question: 'Which density should I enter?', answer: 'Use a supplier or test value for the actual material and condition.' }, { question: 'Are truck loads exact?', answer: 'No. They are rounded planning counts based on the payload you enter.' }, { question: 'Is waste included?', answer: 'Only the visible allowance percentage you enter.' }, { question: 'Can it model irregular areas?', answer: 'No. Divide them into measured shapes or obtain a survey.' }],
    relatedTools: [{ slug: 'cement-calculator', name: 'Cement Calculator' }, { slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'asphalt-calculator', name: 'Asphalt Calculator' }], relatedGuides: [],
  },
  'gravel-calculator': {
    slug: 'gravel-calculator', name: 'Gravel Volume and Weight Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate rectangular gravel volume, metric tonnes, and indicative 15-tonne loads using built-in material-density assumptions.',
    longTailKeywords: ['gravel calculator cubic meters tonnes', 'crushed stone weight calculator', 'driveway gravel quantity estimate', 'pea gravel volume calculator', 'river rock tonnage calculator'],
    intro: ['This tool converts dimensions to a rectangular cubic-metre volume and multiplies by a built-in density for pea gravel, crushed stone, or river rock.', 'The density presets are generic planning assumptions rather than supplier specifications.'],
    formula: [{ title: 'Volume', body: 'Length × width × depth in metres.' }, { title: 'Tonnes', body: 'Volume × assumed density ÷ 1,000.' }],
    steps: ['Measure length, width, and compacted target depth.', 'Select the closest generic material type.', 'Use the result for preliminary planning, then obtain supplier density and compaction guidance.'],
    interpretation: ['Actual tonnes depend on stone grading, moisture, voids, and compaction.', 'A 15-tonne load count is rounded upward and may differ from legal vehicle payload.'], limitations: [...planningLimits, 'No explicit waste or compaction allowance is included.', 'Built-in densities are approximate and truck loads assume 15 metric tonnes.'],
    faqs: [{ question: 'Are the densities exact?', answer: 'No. They are generic assumptions.' }, { question: 'Is compacted depth entered?', answer: 'Use the finished depth and separately account for compaction based on supplier advice.' }, { question: 'Does it include waste?', answer: 'No.' }, { question: 'Are tonnes metric?', answer: 'Yes, 1,000 kg.' }],
    relatedTools: [{ slug: 'cement-calculator', name: 'Cement Calculator' }, { slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'asphalt-calculator', name: 'Asphalt Calculator' }], relatedGuides: ['gravel-calculation-guide', 'asphalt-calculation-guide'],
  },
  'asphalt-calculator': {
    slug: 'asphalt-calculator', name: 'Asphalt Tonnage Calculator with Waste Allowance', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate rectangular asphalt volume and metric tonnes from area, compacted thickness, density, and a custom waste percentage.',
    longTailKeywords: ['asphalt tonnage calculator', 'hot mix asphalt quantity calculator', 'driveway asphalt tonnes estimate', 'asphalt volume density calculator', 'asphalt calculator with waste percentage'],
    intro: ['The asphalt calculator converts area dimensions and thickness to cubic metres, applies a chosen density, and then adds the entered waste allowance.', 'Its truck count assumes 20 metric tonnes per load and is only a logistics illustration.'],
    formula: [{ title: 'Compacted volume', body: 'Length × width × thickness, all converted to metres.' }, { title: 'Order tonnes', body: 'Volume × density ÷ 1,000 × (1 + waste percentage ÷ 100).' }],
    steps: ['Measure paved length and width and specify compacted design thickness.', 'Enter the project-specific compacted asphalt density and waste allowance.', 'Compare calculated tonnes with plant, contractor, lift-thickness, and truck-payload requirements.'],
    interpretation: ['The result assumes uniform rectangular coverage and finished compacted thickness.', 'Loose delivery volume, compaction, temperature, lift design, and mix specification require professional planning.'], limitations: [...planningLimits, 'No slope, variable depth, compaction factor, tack coat, sub-base, joint, or multiple-lift design is modeled.', 'Truck count assumes 20 metric tonnes and may not reflect lawful or available payload.'],
    faqs: [{ question: 'Should I enter loose or compacted thickness?', answer: 'Enter the intended finished compacted thickness.' }, { question: 'Is the default density universal?', answer: 'No. Obtain the design or supplier density for the selected mix.' }, { question: 'Does it design pavement structure?', answer: 'No.' }, { question: 'Are tons metric tonnes?', answer: 'Yes.' }],
    relatedTools: [{ slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }], relatedGuides: ['asphalt-calculation-guide', 'gravel-calculation-guide'],
  },
  'soffit-fascia-calculator': {
    slug: 'soffit-fascia-calculator',
    ...expansionPage({
      name: 'Soffit & Fascia Calculator – Material & Board Quantity',
      description: 'Calculate soffit area, fascia board length, panel count, board quantity and waste allowance for roof eaves.' ,
      keywords: ['soffit calculator', 'fascia calculator', 'soffit and fascia calculator', 'soffit material calculator', 'fascia board calculator', 'fascia board quantity calculator', 'how much soffit do i need'],
      intro: 'Calculate total soffit surface area, fascia linear footage, panel counts, and board quantities with custom waste allowances for roof eaves.',
      formula: 'Soffit area = eave length × soffit depth; Soffit area with waste = soffit area × (1 + waste% / 100); Soffit pieces = ceil(area with waste ÷ panel coverage); Fascia length with waste = eave length × (1 + waste% / 100); Fascia boards = ceil(length with waste ÷ board length).',
      interpretation: 'Soffit pieces and fascia boards round up to the next whole piece to account for standard supplier units and end-cuts.',
      limitations: [
        'Estimates straight eave runs only; roof geometry, gables, hip returns, and rake boards require separate takeoffs.',
        'Manufacturer panel dimensions, vented vs solid exposure, and seam overlaps may alter piece requirements.',
        'Confirm physical field measurements and local building code ventilation requirements before purchasing.',
      ],
      relatedTools: [
        { slug: 'roof-area-calculator', name: 'Roof Area Calculator' },
        { slug: 'roof-pitch-calculator', name: 'Roof Pitch Calculator' },
        { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' },
      ],
      faq: [
        { question: 'How do you calculate soffit area?', answer: 'Multiply the total linear length of the eaves by the soffit depth (overhang width from the wall to the fascia board).' },
        { question: 'How much waste should I add for soffit and fascia?', answer: 'A 10% to 15% waste factor is typical to account for miter cuts at corners, seam overlapping, and offcuts.' },
        { question: 'Does this include gable overhangs (rakes)?', answer: 'No. Gable rakes slope with the roof pitch and should be calculated separately and added to the total run.' },
      ],
    }),
  },
  'attic-insulation-payback-calculator': {
    slug: 'attic-insulation-payback-calculator',
    ...expansionPage({
      name: 'Attic Insulation Payback Calculator',
      description: 'Estimate attic insulation project cost, annual energy savings, and simple payback period.',
      keywords: ['attic insulation payback calculator', 'insulation savings calculator', 'insulation roi calculator', 'attic insulation cost savings', 'insulation payback period'],
      intro: 'Estimate installation costs, utility bill savings, and payback period from upgrading attic insulation with optional rebates and incentives.',
      formula: 'Gross cost = attic area × installed cost per unit; Net cost = max(0, gross cost - rebates); Annual savings = annual energy cost × (savings% / 100); Monthly savings = annual savings ÷ 12; Simple payback = net cost ÷ annual savings.',
      interpretation: 'Simple payback estimates the number of years for cumulative heating and cooling bill reductions to equal initial net project expenditure.',
      limitations: [
        'Simple payback planning estimate, not a dynamic whole-building energy simulation.',
        'Actual savings depend on climate zone, current insulation R-value, air leakage, HVAC efficiency, fuel type, and thermostat settings.',
        'Does not include inflation in energy prices, equipment maintenance, or financing interest.',
      ],
      relatedTools: [
        { slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' },
        { slug: 'heat-pump-vs-furnace-cost-calculator', name: 'Heat Pump vs Furnace Cost Calculator' },
        { slug: 'electricity-cost-calculator', name: 'Electricity Cost Calculator' },
      ],
      faq: [
        { question: 'What is a typical payback period for attic insulation?', answer: 'Attic insulation upgrades commonly pay back in 3 to 10 years, depending on existing insulation levels, local energy rates, and available utility rebates.' },
        { question: 'How much energy does attic insulation save?', answer: 'The EPA estimates air sealing and adding attic insulation saves an average of 15% on heating and cooling costs (roughly 11% of total home energy).' },
        { question: 'What if utility rebates exceed project cost?', answer: 'If rebates cover the entire installation, net cost and payback period are 0 years, providing immediate net positive cash flow.' },
      ],
    }),
  },
  'joist-deflection-calculator': {
    slug: 'joist-deflection-calculator',
    ...expansionPage({
      name: 'Joist Deflection Calculator',
      description: 'Estimate simple beam or joist deflection under uniformly distributed load and compare against L/360 limits.',
      keywords: ['joist deflection calculator', 'floor joist deflection calculator', 'beam deflection calculator', 'l over 360 calculator', 'joist sag calculator'],
      intro: 'Calculate midspan bending deflection, moment of inertia, tributary line load, and span-to-deflection ratios for simply supported floor joists.',
      formula: 'Tributary line load w = uniform load (psf) × spacing (ft); Moment of inertia I = b × d³ ÷ 12; Maximum deflection delta = 5wL⁴ ÷ (384EI); Allowable limit = L ÷ 360; Ratio = L ÷ delta.',
      interpretation: 'Higher span-to-deflection ratios (e.g. L/480 or L/720) indicate stiffer floors with less noticeable bounce, vibration, and finish cracking.',
      limitations: [
        'Educational engineering estimate for simply supported, prismatic rectangular members with static uniform loads.',
        'Does not evaluate shear deformation, vibration/bounce dynamics, composite subfloor action, duration of load factors, holes, notches, or connection stiffness.',
        'Does not certify structural safety or building code compliance; consult a licensed structural engineer for actual building design.',
      ],
      relatedTools: [
        { slug: 'stair-stringer-calculator', name: 'Stair & Stringer Calculator' },
        { slug: 'steel-weight-calculator', name: 'Steel Weight Calculator' },
        { slug: 'deck-board-calculator', name: 'Deck Board Calculator' },
      ],
      faq: [
        { question: 'What is the L/360 deflection standard?', answer: 'L/360 is the traditional building code deflection limit for floor live loads (span in inches divided by 360), designed to prevent plaster cracking and excessive sag.' },
        { question: 'Should I use nominal or actual lumber dimensions?', answer: 'Always use actual dimensions (e.g. 1.5 inches by 9.25 inches for a nominal 2x10 joist).' },
        { question: 'What modulus of elasticity (E) should I use?', answer: 'Standard dimension framing lumber (such as No. 2 Douglas Fir or Southern Pine) typically has an E between 1,400,000 psi and 1,700,000 psi. Engineered lumber (LVL) is often 1,900,000 to 2,000,000 psi.' },
      ],
    }),
  },
  'hvac-duct-cfm-calculator': {
    slug: 'hvac-duct-cfm-calculator',
    ...expansionPage({
      name: 'HVAC Duct CFM Calculator',
      description: 'Estimate airflow through round or rectangular HVAC ducts from duct cross-sectional area and air velocity.',
      keywords: ['duct cfm calculator', 'hvac cfm calculator', 'duct airflow calculator', 'round duct cfm calculator', 'rectangular duct cfm calculator'],
      intro: 'Calculate volumetric airflow rate in cubic feet per minute (CFM) for round and rectangular HVAC ducts using internal cross-sectional area and air velocity.',
      formula: 'Round area (sq ft) = π × (diameter / 2)² ÷ 144; Rectangular area (sq ft) = (width × height) ÷ 144; Airflow CFM = duct area (sq ft) × velocity (ft/min).',
      interpretation: 'Airflow is directly proportional to internal cross-sectional duct area and air velocity. Branch ducts typically operate at 600 to 800 FPM, while main supply trunks run at 700 to 1,000 FPM.',
      limitations: [
        'Calculates theoretical airflow from cross-sectional area and air velocity only (Q = A × V).',
        'Does not size complete duct systems, calculate static pressure drops, friction loss, equivalent fitting lengths, or fan curves.',
        'Use ACCA Manual D or ASHRAE fundamentals for comprehensive HVAC residential and commercial duct sizing.',
      ],
      relatedTools: [
        { slug: 'air-compressor-cfm-calculator', name: 'Air Compressor CFM Calculator' },
        { slug: 'voltage-drop-calculator', name: 'Voltage Drop Calculator' },
        { slug: 'wire-size-calculator', name: 'Wire Size Calculator' },
      ],
      faq: [
        { question: 'What is CFM in HVAC?', answer: 'CFM stands for Cubic Feet per Minute, measuring the volume of conditioned air circulated through ducts and spaces.' },
        { question: 'What is standard residential duct air velocity?', answer: 'Residential branch ducts typically aim for 600 to 700 FPM to keep air noise quiet, while supply trunks run 700 to 900 FPM.' },
        { question: 'How do I convert round duct diameter to CFM?', answer: 'Find the cross-sectional area in square feet: π × (diameter ÷ 2)² ÷ 144, then multiply by air velocity in feet per minute (FPM).' },
      ],
    }),
  },
  'square-footage-calculator': {
    slug: 'square-footage-calculator',
    ...expansionPage({
      name: 'Square Footage Calculator – Calculate Area in Square Feet',
      description: 'Calculate square footage from length and width, then convert the total area to square yards and square meters.',
      keywords: ['square footage calculator', 'square feet calculator', 'calculate square footage', 'room square footage calculator', 'area calculator square feet', 'how many square feet is my room'],
      intro: 'Enter length and width in feet to calculate square footage for a room, floor, wall, patio or other rectangular area.',
      formula: 'Square feet = length in feet × width in feet. Multiply by quantity for repeated equal areas.',
      interpretation: 'The calculator also converts total area to square yards and square meters for estimating flooring, paint, landscaping or construction quantities.',
      limitations: ['Assumes rectangular areas.', 'For irregular shapes, divide the project into simpler rectangles and add their areas.', 'Measurements should use the same physical reference points.'],
      relatedTools: [{slug:'flooring-calculator',name:'Flooring Calculator'},{slug:'paint-calculator',name:'Paint Calculator'},{slug:'tile-calculator',name:'Tile Calculator'}],
      faq: [
        {question:'How do I calculate square footage?',answer:'Multiply length in feet by width in feet. A 12 ft by 10 ft room is 120 square feet.'},
        {question:'How do I calculate an L-shaped room?',answer:'Split it into two or more rectangles, calculate each square footage separately, then add the results.'},
        {question:'How many square feet are in a square yard?',answer:'One square yard equals 9 square feet.'}
      ],
    }),
  },
  'cubic-yard-calculator': {
    slug: 'cubic-yard-calculator',
    ...expansionPage({
      name: 'Cubic Yard Calculator – Calculate Material Volume',
      description: 'Calculate cubic yards from length, width and depth for concrete, gravel, soil, mulch and other bulk materials.',
      keywords: ['cubic yard calculator', 'cubic yards calculator', 'calculate cubic yards', 'cubic yard volume calculator', 'how many cubic yards do i need', 'cubic feet to cubic yards project calculator'],
      intro: 'Enter project length and width in feet plus material depth in inches to calculate cubic feet, cubic yards and cubic meters.',
      formula: 'Cubic feet = length × width × depth in feet; cubic yards = cubic feet ÷ 27; optional order quantity adds the entered allowance.',
      interpretation: 'Use the extra allowance for waste, settlement or field variation when appropriate for the material.',
      limitations: ['Assumes a rectangular volume with uniform depth.', 'Compaction, excavation swell and material density are not included.', 'Supplier delivery minimums and rounding rules vary.'],
      relatedTools: [{slug:'concrete-calculator',name:'Concrete Calculator'},{slug:'gravel-calculator',name:'Gravel Calculator'},{slug:'mulch-calculator',name:'Mulch Calculator'}],
      faq: [
        {question:'How many cubic feet are in a cubic yard?',answer:'There are 27 cubic feet in one cubic yard.'},
        {question:'How do I calculate cubic yards from inches of depth?',answer:'Convert depth from inches to feet by dividing by 12, multiply by length and width in feet, then divide cubic feet by 27.'},
        {question:'Should I add extra material?',answer:'Often yes. Waste, settlement, compaction and uneven grades can increase the amount needed.'}
      ],
    }),
  },
  'roofing-shingle-calculator': {
    slug: 'roofing-shingle-calculator',
    ...expansionPage({
      name: 'Roofing Shingle Calculator – Squares & Bundles Needed',
      description: 'Estimate roofing squares and shingle bundles from roof surface area, waste allowance and bundles per square.',
      keywords: ['roofing shingle calculator', 'shingle calculator', 'roof shingles calculator', 'how many bundles of shingles do i need', 'roofing squares calculator', 'shingle bundles calculator'],
      intro: 'Enter measured roof surface area, waste percentage and the number of bundles your shingle product uses per roofing square.',
      formula: 'Order area = roof area × (1 + waste%); roofing squares = order area ÷ 100; bundles = roofing squares × bundles per square, rounded up.',
      interpretation: 'One roofing square covers 100 square feet. Many asphalt shingles use about three bundles per square, but product coverage varies.',
      limitations: ['Requires roof surface area, not just building floor area.', 'Bundle coverage varies by manufacturer and product.', 'Starter shingles, ridge caps, underlayment, flashing and accessories are separate.'],
      relatedTools: [{slug:'roof-area-calculator',name:'Roof Area Calculator'},{slug:'roof-pitch-calculator',name:'Roof Pitch Calculator'},{slug:'roof-ridge-height-calculator',name:'Roof Ridge Height Calculator'}],
      faq: [
        {question:'How many square feet are in a roofing square?',answer:'One roofing square equals 100 square feet of roof surface.'},
        {question:'How many bundles are in a square of shingles?',answer:'Three bundles is common for many asphalt shingles, but always verify the product label because coverage varies.'},
        {question:'How much waste should I add?',answer:'Simple roofs may need around 5–10%, while complex roofs with valleys, hips and many cuts can require more.'}
      ],
    }),
  },
  'rafter-length-calculator': {
    slug: 'rafter-length-calculator',
    ...expansionPage({
      name: 'Rafter Length Calculator – Roof Pitch, Run & Overhang',
      description: 'Calculate common rafter length from horizontal run and roof pitch, with optional overhang and roof-angle output.',
      keywords: ['rafter length calculator', 'roof rafter calculator', 'calculate rafter length', 'rafter calculator pitch and run', 'common rafter length calculator', 'roof pitch rafter calculator'],
      intro: 'Enter the horizontal run and roof pitch to calculate geometric common-rafter length, rise and roof angle, with an optional horizontal overhang.',
      formula: 'Rise = run × pitch rise ÷ 12; rafter length = √(run² + rise²). The same slope is extended across the optional overhang.',
      interpretation: 'The result is geometric slope length before framing deductions and cuts.',
      limitations: ['Does not include ridge-board deduction, birdsmouth, plumb-cut allowance or material defects.', 'Does not size rafters or verify structural loads.', 'Use framing plans and local code requirements for construction.'],
      relatedTools: [{slug:'roof-pitch-calculator',name:'Roof Pitch Calculator'},{slug:'roof-ridge-height-calculator',name:'Roof Ridge Height Calculator'},{slug:'roof-area-calculator',name:'Roof Area Calculator'}],
      faq: [
        {question:'How do I calculate rafter length?',answer:'Calculate roof rise from run and pitch, then use the Pythagorean theorem: rafter length = square root of run squared plus rise squared.'},
        {question:'Does the calculator include roof overhang?',answer:'Yes, if you enter a horizontal overhang. The slope is extended over that extra run.'},
        {question:'Does this tell me what size lumber to use?',answer:'No. It calculates geometry only, not structural member size.'}
      ],
    }),
  },
  'stud-calculator': {
    slug: 'stud-calculator',
    ...expansionPage({
      name: 'Stud Calculator – How Many Wall Studs Do I Need?',
      description: 'Estimate wall studs from wall length and on-center spacing, with extra studs for corners or openings and a waste allowance.',
      keywords: ['stud calculator', 'wall stud calculator', 'how many studs do i need', '16 inch on center stud calculator', '24 inch on center stud calculator', 'framing stud calculator'],
      intro: 'Enter wall length and stud spacing to estimate the basic number of studs, then add extras for corners, openings or other framing details.',
      formula: 'Base studs = ceiling(wall length in inches ÷ on-center spacing) + 1. Extra studs and waste are then added.',
      interpretation: 'The base count represents a simple straight wall with a stud at each end.',
      limitations: ['Doors, windows, corners, intersections, backing, headers, cripples and blocking can require more lumber.', 'Framing details vary by design and code.', 'This is a material-planning estimate, not a framing plan.'],
      relatedTools: [{slug:'board-foot-calculator',name:'Board Foot Calculator'},{slug:'drywall-calculator',name:'Drywall Calculator'},{slug:'construction-material-waste-calculator',name:'Construction Material Waste Calculator'}],
      faq: [
        {question:'How many studs do I need for a wall?',answer:'Divide wall length in inches by stud spacing, round up and add one end stud, then add studs required for corners and openings.'},
        {question:'What does 16 inches on center mean?',answer:'It means stud centerlines are spaced 16 inches apart along the wall.'},
        {question:'Should I add extra studs?',answer:'Yes. Corners, doors, windows, wall intersections and backing often require additional studs.'}
      ],
    }),
  },
  'drywall-mud-calculator': {
    slug: 'drywall-mud-calculator',
    ...expansionPage({
      name: 'Drywall Mud Calculator – Joint Compound Quantity',
      description: 'Estimate drywall joint compound containers from drywall area, product coverage and an extra allowance.',
      keywords: ['drywall mud calculator', 'joint compound calculator', 'how much drywall mud do i need', 'drywall compound calculator', 'sheetrock mud calculator', 'drywall joint compound coverage calculator'],
      intro: 'Enter total drywall area and the manufacturer coverage for your joint-compound bucket or box to estimate how many containers to buy.',
      formula: 'Adjusted area = drywall area × (1 + allowance%); containers = adjusted area ÷ product coverage, rounded up.',
      interpretation: 'Use the coverage printed by the compound manufacturer because premixed and setting-type products can have different practical coverage.',
      limitations: ['Coverage varies with number of coats, tape, bead, texture, workmanship and product.', 'This calculator does not estimate tape, corner bead or drywall sheets.', 'Use product-specific coverage whenever available.'],
      relatedTools: [{slug:'drywall-calculator',name:'Drywall Calculator'},{slug:'construction-material-waste-calculator',name:'Construction Material Waste Calculator'},{slug:'paint-calculator',name:'Paint Calculator'}],
      faq: [
        {question:'How much drywall mud do I need?',answer:'Divide your adjusted drywall area by the coverage stated for the compound container, then round up to a whole container.'},
        {question:'Why does drywall mud coverage vary?',answer:'Joint count, number of coats, bead, texture, product consistency and installer technique all affect usage.'},
        {question:'Does this calculate drywall sheets too?',answer:'No. Use the separate Drywall Calculator for sheet quantity.'}
      ],
    }),
  },
  'roof-ridge-height-calculator': {
    slug: 'roof-ridge-height-calculator',
    ...expansionPage({
      name: 'Roof Ridge Height Calculator – Calculate Ridge Rise from Roof Pitch',
      description: 'Calculate roof ridge height for a symmetrical gable roof from building span, roof pitch and wall height. See ridge rise, total ridge height, roof angle and geometric rafter length.',
      keywords: ['roof ridge height calculator', 'ridge height calculator', 'roof height calculator', 'calculate roof ridge height', 'roof pitch height calculator', 'gable roof ridge height', '6 12 roof ridge height calculator'],
      intro: 'Enter the building span, roof pitch and wall height to calculate how high the ridge rises above the wall plates and the total ridge height.',
      formula: 'Half-span = span ÷ 2; ridge rise = half-span × (pitch rise ÷ 12); total ridge height = wall height + ridge rise.',
      interpretation: 'For a symmetrical gable roof, a steeper pitch or wider span increases ridge rise. The rafter result is geometric length from wall plate to ridge before overhangs and cuts.',
      limitations: ['Assumes a symmetrical gable roof with equal slopes on both sides.', 'Does not include ridge-board thickness, truss heel height, birdsmouth cuts, overhang, ceiling build-up or structural member sizing.', 'Verify actual framing plans and code requirements before construction.'],
      relatedTools: [{slug:'roof-pitch-calculator',name:'Roof Pitch Calculator'},{slug:'roof-area-calculator',name:'Roof Area Calculator'},{slug:'12-foot-gambrel-roof-truss-calculator',name:'Gambrel Roof Truss Calculator'}],
      faq: [
        {question:'How do you calculate roof ridge height?',answer:'For a symmetrical gable roof, divide the span by two and multiply that half-span by the roof rise-per-12 divided by 12. Add the result to wall or plate height if you need total ridge height.'},
        {question:'What is the ridge rise for a 24 ft span with a 6:12 pitch?',answer:'Half the span is 12 ft. At 6:12 pitch, ridge rise is 12 × 6 ÷ 12 = 6 ft above the wall plates.'},
        {question:'Does this calculate structural rafter size?',answer:'No. It calculates geometry only, not structural capacity.'}
      ],
    }),
  },
  'fascia-replacement-cost-calculator': {
    slug: 'fascia-replacement-cost-calculator',
    ...expansionPage({
      name: 'Fascia Replacement Cost Calculator – Estimate Cost per Linear Foot',
      description: 'Estimate fascia board replacement cost from linear feet, material price, labor rate, waste and removal or disposal allowance.',
      keywords: ['fascia replacement cost calculator', 'fascia board replacement cost calculator', 'fascia repair cost calculator', 'fascia cost per linear foot', 'replace fascia board cost', 'how much does fascia replacement cost'],
      intro: 'Enter the fascia length and your local material and labor rates to estimate replacement cost per linear foot and total project cost.',
      formula: 'Order length = measured fascia length × (1 + waste%); material cost = order length × material rate; labor cost = measured length × labor rate; total = material + labor + removal/disposal.',
      interpretation: 'The result separates material, labor and removal allowances so you can replace the default planning inputs with local contractor or supplier rates.',
      limitations: ['Does not provide live local prices or contractor quotes.', 'Hidden rot, soffit damage, gutters, access height, scaffolding, painting, permits, taxes and structural repair can materially change actual cost.', 'Use measured linear feet and project-specific rates.'],
      relatedTools: [{slug:'soffit-fascia-calculator',name:'Soffit & Fascia Calculator'},{slug:'construction-cost-calculator',name:'Construction Cost Calculator'},{slug:'contractor-estimate-generator',name:'Contractor Estimate Generator'}],
      faq: [
        {question:'How is fascia replacement cost calculated?',answer:'Multiply measured fascia length by labor rate, add material cost including waste, then add removal or disposal and other project allowances.'},
        {question:'Should I add waste to fascia boards?',answer:'Yes. A waste allowance helps cover end cuts, damaged sections and board-length optimization.'},
        {question:'Does this include soffit or gutter replacement?',answer:'No, unless you include those costs in your entered rates or allowance.'}
      ],
    }),
  },
  'shed-ramp-angle-calculator': {
    slug: 'shed-ramp-angle-calculator',
    ...expansionPage({
      name: 'Shed Ramp Angle Calculator – Find Ramp Angle & Length',
      description: 'Calculate a shed or equipment ramp angle from rise and run. See slope percentage, rise-to-run ratio and ramp surface length.' ,
      keywords: ['shed ramp angle calculator', 'shed ramp calculator', 'ramp slope calculator', 'mower shed ramp calculator', 'ramp length calculator', 'how to find the angle of a ramp', 'calculate ramp angle', 'ramp angle calculator rise run'],
      intro: 'Enter ramp rise and horizontal run to find the ramp angle in degrees, slope percentage, rise-to-run ratio and surface length.',
      formula: 'Slope angle = arctan(rise ÷ run) in degrees; Slope percentage = (rise ÷ run) × 100; Ramp surface length = √(rise² + run²); Slope ratio = 1 : (run ÷ rise).',
      interpretation: 'A lower slope angle (under 12° to 15°) prevents lawn mower deck bottoming, equipment rollover, and slipping during wet conditions.',
      limitations: [
        'Pure geometric right-triangle calculation; does not certify ADA accessibility, structural load capacity, or local building code compliance.',
        'Safe ramp slope depends on equipment ground clearance, wheel wheelbase, surface traction, and weather conditions.',
        'Ramps steeper than 15° can be hazardous for heavy equipment and walking with loads.',
      ],
      relatedTools: [
        { slug: 'stair-stringer-calculator', name: 'Stair & Stringer Calculator' },
        { slug: 'roof-pitch-calculator', name: 'Roof Pitch Calculator' },
        { slug: 'ladder-safe-reach-calculator', name: 'Ladder Safe Reach Calculator' },
      ],
      faq: [
        { question: 'What is a good slope angle for a shed ramp?', answer: 'For riding lawn mowers and snowblowers, an angle of 10° to 15° (approximately a 1:4 to 1:6 ratio) is recommended to prevent mower deck scraping and slipping.' },
        { question: 'How long should a shed ramp be for a 12-inch rise?', answer: 'For a 12-inch rise, a 48-inch run gives a 14° slope (1:4 ratio) with a 49.5-inch surface length. A 60-inch run gives an easier 11.3° slope (1:5 ratio) with a 61.2-inch ramp surface.' },
        { question: 'Is a shed ramp governed by ADA guidelines?', answer: 'ADA requires 1:12 slope (4.76°) for pedestrian handicap ramps. Equipment utility ramps can be steeper but require sufficient deck clearance and traction.' },
      ],
    }),
  },
  'construction-material-waste-calculator': {
    slug: 'construction-material-waste-calculator',
    ...expansionPage({
      name: 'Construction Material Waste Calculator',
      description: 'Calculate material order quantities and waste allowance costs from net project requirements.',
      keywords: ['construction waste calculator', 'material waste calculator', 'waste factor calculator', 'construction material allowance calculator', 'material overage calculator'],
      intro: 'Apply a percentage waste allowance to net material quantities to calculate recommended order amounts, scrap quantities, and itemized material costs.',
      formula: 'Waste quantity = net quantity × (waste% ÷ 100); Order quantity = net quantity + waste quantity; Net cost = net quantity × unit cost; Waste cost = waste quantity × unit cost; Total cost = order quantity × unit cost.',
      interpretation: 'Applies contingency overage to account for pattern matching, offcuts, irregular room shapes, edge trim, and transport damage.',
      limitations: [
        'Waste allowance percentages vary widely by material type, installer skill, geometric complexity, and layout pattern.',
        'Calculated quantities must typically be rounded up to whole commercial purchasing units (cartons, boxes, sheets, bundles, or pallets).',
        'Verify packaging specifications and supplier minimum order quantities before placing orders.',
      ],
      relatedTools: [
        { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' },
        { slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' },
        { slug: 'drywall-calculator', name: 'Drywall Calculator' },
      ],
      faq: [
        { question: 'What is standard construction waste percentage?', answer: 'Standard allowances are typically 5% for simple dimensional lumber and decking, 10% for drywall, siding, and roofing, and 15% to 20% for ceramic tile and stone with diagonal cuts.' },
        { question: 'Why is waste allowance necessary?', answer: 'End cuts, miter angles, broken pieces, edge trimming, and future repair stock require ordering more material than exact measured net square footage.' },
        { question: 'How do I convert order quantity into packages?', answer: 'Divide the total recommended order quantity by the coverage per box, roll, or pallet from the manufacturer, then round up to the next whole package.' },
      ],
    }),
  },
  'mortar-calculator': {
    slug: 'mortar-calculator',
    ...expansionPage({
      name: 'Mortar Calculator – Brick & Block Mortar Quantity',
      description: 'Calculate how much mortar you need for brickwork or concrete block walls, including premix bags, cement, sand and waste.' ,
      keywords: ['mortar calculator', 'mortar mix calculator', 'brick mortar calculator', 'how many bags of mortar do i need', 'masonry mortar calculator', 'calculating mortar for brickwork', 'mortar quantity calculator', 'mortar calculator for bricks'],
      intro: 'Enter the number of bricks or blocks, joint thickness and waste allowance to estimate mortar quantity, premix bags, cement and sand.',
      formula: 'Mortar volume = unit count × base yield per unit × (joint thickness / 0.375) × (1 + waste / 100). Pre-mix bags = ceil(adjusted volume / bag yield). Type N site mix: 1 bag Portland cement (94 lb) + 3 ft³ sand yields ~3.2 ft³ mortar.',
      interpretation: 'Standard modular clay bricks require approx 5.0 ft³ of mortar per 1,000 bricks at 3/8-inch joints. Standard 8x8x16 CMU concrete blocks require approx 13.5 ft³ of mortar per 100 blocks. 80-lb pre-mix bags yield approx 0.67 ft³.',
      limitations: [
        'Mortar yield varies by brick coring depth, frog impressions, and CMU face-shell bedding vs full bedding.',
        'Site-mixed mortar must adhere to standard ASTM C270 proportioning (Type N, S, or M) for required compressive strength.',
        'Weather conditions, evaporation, and joint tooling loss will alter field material consumption.',
      ],
      relatedTools: [
        { slug: 'brick-calculator', name: 'Brick Calculator' },
        { slug: 'concrete-block-calculator', name: 'Concrete Block Calculator' },
        { slug: 'cement-calculator', name: 'Cement Calculator' },
        { slug: 'sand-calculator', name: 'Sand Calculator' },
      ],
      faq: [
        { question: 'How many bags of mortar do I need for 1000 bricks?', answer: 'For 1,000 standard modular bricks with 3/8-inch joints and 10% waste, you will need approximately 8 to 9 bags of 80-lb pre-mixed mortar mix.' },
        { question: 'How much mortar is needed for 100 cinder blocks?', answer: 'For 100 standard 8x8x16 CMU concrete blocks with face-shell bedding, you need approximately 13.5 ft³ of mortar, which corresponds to roughly 22 to 24 bags of 80-lb pre-mix mortar.' },
        { question: 'What is the difference between Type N and Type S mortar?', answer: 'Type N is a medium-strength mortar (approx 750 psi) used for general exterior above-grade walls and brick veneer. Type S is higher strength (approx 1,800 psi) used for below-grade foundations, retaining walls, and load-bearing CMU blocks.' },
      ],
    }),
  },
  'concrete-block-calculator': {
    slug: 'concrete-block-calculator',
    ...expansionPage({
      name: 'Concrete Block Calculator',
      description: 'Estimate CMU concrete blocks, mortar, core-fill grout, and waste allowance for block walls and foundations.',
      keywords: ['concrete block calculator', 'cmu calculator', 'cinder block calculator', 'concrete masonry unit calculator', 'block wall estimator'],
      intro: 'Calculate total CMU blocks, face-shell mortar bags, and core-fill grout volume needed for concrete masonry unit walls, retaining walls, and foundation stems.',
      formula: 'Net wall area = (length × height) − openings area; Exact CMU blocks = net area × 1.125 blocks/ft²; Purchase blocks = ceil(exact blocks × (1 + waste/100)); Mortar = purchase blocks × 0.135 ft³; Core grout = purchase blocks × cores/block × 0.33 ft³ / 27.',
      interpretation: 'Nominal 8x8x16 CMU blocks cover 1.125 blocks per square foot of wall face (0.8889 ft² each). Grouting schedules can be hollow (0 cores), 32" on-center (0.5 cores/block), 16" on-center (1 core/block), or solid grouted (2 cores/block).',
      limitations: [
        'Structural reinforcement spacing, bond beams, and vertical rebar cores must be designed by a licensed structural engineer.',
        'Opening takeoffs should account for lintel blocks, bond beams, and half-blocks at jamb corners.',
        'Core fill grout volume assumes standard 2-core hollow CMU units without excessive blow-outs.',
      ],
      relatedTools: [
        { slug: 'mortar-calculator', name: 'Mortar Calculator' },
        { slug: 'brick-calculator', name: 'Brick Calculator' },
        { slug: 'concrete-calculator', name: 'Concrete Calculator' },
        { slug: 'rebar-calculator', name: 'Rebar Calculator' },
      ],
      faq: [
        { question: 'How many concrete blocks are in a square foot of wall?', answer: 'One standard 8x8x16 CMU block measures 15-5/8" × 7-5/8" plus a 3/8" mortar joint (16" × 8" nominal). This equals 128 square inches or 0.8889 sq ft, meaning you need exactly 1.125 blocks per square foot of wall surface.' },
        { question: 'How much grout does an 8-inch CMU block hold?', answer: 'Each core cell in a standard 8x8x16 hollow CMU block holds approximately 0.33 cubic feet of grout. Filling both cores completely requires about 0.66 cubic feet per block.' },
        { question: 'What waste percentage should I order for concrete blocks?', answer: 'A 5% to 10% waste allowance is standard for straight walls to account for cuts at corners, half-blocks, and transit breakage. Order 10% to 15% for complex walls with numerous window and door openings.' },
      ],
    }),
  },
  'rainwater-harvesting-calculator': {
    slug: 'rainwater-harvesting-calculator',
    ...expansionPage({
      name: 'Rainwater Harvesting Calculator',
      description: 'Calculate harvestable rainwater volume from roof catchment area, annual rainfall, and roof material runoff coefficients, then size a storage tank.',
      keywords: ['rainwater harvesting calculator', 'rainwater collection calculator', 'roof runoff calculator', 'rain barrel sizing calculator', 'water catchment calculator'],
      intro: 'Estimate annual and monthly rainwater collection potential from roof catchment areas, applying material-specific runoff efficiency and first-flush diversion to size storage cisterns.',
      formula: 'Annual yield (gallons) = catchment area (ft²) × annual rainfall (in) × 0.6233 gal/ft²-in × runoff coefficient × (1 − filter loss / 100); Recommended tank capacity = (annual yield / 365) × dry-period storage days.',
      interpretation: '1 inch of rainfall over 1,000 square feet of roof yields approximately 623 gallons of water before efficiency deductions. Metal roofs provide the highest catchment efficiency (0.95), followed by glazed tile (0.85), flat membrane (0.85), and asphalt shingles (0.80).',
      limitations: [
        'Rainfall distribution is seasonal; monthly rainfall totals vary significantly from uniform annual averages.',
        'Potable drinking use requires certified sediment filtration, sub-micron carbon block filters, and UV disinfection.',
        'Verify local municipal codes and water rights regarding residential rainwater harvesting cisterns.',
      ],
      relatedTools: [
        { slug: 'roof-area-calculator', name: 'Roof Area Calculator' },
        { slug: 'water-tank-calculator', name: 'Water Tank Calculator' },
        { slug: 'mulch-calculator', name: 'Mulch Calculator' },
      ],
      faq: [
        { question: 'How much rainwater can I collect from a 2,000 sq ft roof?', answer: 'In an area with 35 inches of annual rainfall, a 2,000 sq ft metal roof yields approximately 39,000 to 41,000 gallons (approx 150,000 liters) of clean harvestable water per year.' },
        { question: 'Why does roof material affect rainwater catchment yield?', answer: 'Different materials have different absorption and friction factors. Smooth metal roofs lose only ~5% of water to evaporation/texture, while porous asphalt shingles absorb water and release loose granules, losing ~20%.' },
        { question: 'How large should my rainwater collection tank be?', answer: 'For landscape irrigation, size your cistern to store 2 to 4 weeks of dry-spell demand. For whole-home non-potable toilet and laundry use, standard cisterns typically range between 1,500 and 5,000 gallons.' },
      ],
    }),
  },
};
