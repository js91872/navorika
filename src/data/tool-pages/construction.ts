import type { ToolPageContent } from '@/lib/seo/toolPage';

function expansionPage(input: { name:string; description:string; keywords:string[]; intro:string; formula:string; interpretation:string; limitations:string[]; relatedTools:{slug:string;name:string}[]; faq:{question:string;answer:string}[] }): Omit<ToolPageContent,'slug'> {
  return {name:input.name,description:input.description,longTailKeywords:input.keywords,category:'Construction Calculators',applicationCategory:'UtilitiesApplication',intro:[input.intro,'Inputs and calculations stay in your browser and require no signup.'],formula:[{title:'Planning calculation',body:input.formula}],steps:['Enter measured project dimensions and quantities.','Adjust material, spacing, waste or density assumptions to match the project.','Review the live planning quantities.','Round purchasing quantities appropriately and confirm field conditions.'],interpretation:[input.interpretation,'Results use the units shown beside each field and output.'],limitations:input.limitations,faqs:input.faq,relatedTools:input.relatedTools,relatedGuides:[]};
}

const planningLimits = ['Results are planning estimates, not engineering, supplier, hauling, compaction, or safety advice.', 'Confirm measured dimensions, material density, waste, load capacity, local units, and supplier minimums before ordering.'];

export const constructionToolPages: Record<string, ToolPageContent> = {
  'roof-pitch-calculator': {slug:'roof-pitch-calculator',...expansionPage({name:'Roof Pitch Calculator',description:'Convert rise and run into X:12 pitch, angle, percentage, rafter multiplier and optional geometric rafter length.',keywords:['roof pitch calculator rise run','6 12 roof angle calculator','rafter multiplier calculator'],intro:'Translate roof rise and horizontal run into several common slope formats.',formula:'Slope = rise ÷ run; angle = arctangent of slope; multiplier = √(1 + slope²).',interpretation:'A 6:12 roof rises 6 units per 12 horizontal units, which is a 50% slope and about 26.565°.',limitations:['Geometry does not establish rafter size, load capacity, connections or code compliance.','Use actual horizontal run for rafter length and separately account for overhangs and cuts.'],relatedTools:[{slug:'roof-area-calculator',name:'Roof Area Calculator'},{slug:'ladder-safe-reach-calculator',name:'Ladder Safe Reach Calculator'}],faq:[{question:'What angle is a 6:12 pitch?',answer:'Approximately 26.565 degrees.'},{question:'Is pitch the same as percent slope?',answer:'They describe the same slope differently; 6:12 equals 50%.'},{question:'Does this size rafters?',answer:'No. It calculates geometry only.'}]})},
  'stair-stringer-calculator': {slug:'stair-stringer-calculator',...expansionPage({name:'Stair & Stringer Calculator',description:'Calculate stair riser count, actual height, tread count, total run, stringer length and angle for planning.',keywords:['stair stringer calculator','riser tread calculator','stair total run calculator'],intro:'Balance a measured total rise across equal risers and derive the matching stair run.',formula:'Risers round up from total rise ÷ maximum riser; treads are one fewer; the stringer is the right-triangle hypotenuse.',interpretation:'Actual riser height is recalculated so every riser is equal after choosing a whole riser count.',limitations:['Planning only; no universal code-compliance claim is made.','Verify local limits, headroom, landings, nosing, guards, handrails and stringer strength.'],relatedTools:[{slug:'ladder-safe-reach-calculator',name:'Ladder Safe Reach Calculator'},{slug:'saw-kerf-calculator',name:'Saw Kerf Calculator'}],faq:[{question:'Why are there fewer treads than risers?',answer:'A typical stair flight ends at the upper floor, leaving one fewer horizontal tread.'},{question:'Are all risers equal?',answer:'The tool divides total rise evenly across the calculated whole number of risers.'},{question:'Does it guarantee code compliance?',answer:'No. Requirements vary by jurisdiction and configuration.'}]})},
  'deck-board-calculator': {slug:'deck-board-calculator',...expansionPage({name:'Deck Board Calculator',description:'Estimate deck board rows, stock boards, linear footage, face coverage and waste with correct gap spacing.',keywords:['deck board calculator with spacing','decking linear feet calculator','actual deck board width'],intro:'Plan decking from deck dimensions, actual board width, gap, orientation and available stock length.',formula:'Rows satisfy rows × board width + (rows − 1) × gap across the deck; each row is divided by stock length.',interpretation:'The result distinguishes board-face coverage from the deck footprint and counts stock boards after waste.',limitations:['Enter actual rather than nominal lumber width.','Layouts with picture frames, diagonal boards, complex joints or mixed stock lengths need additional allowance.'],relatedTools:[{slug:'board-foot-calculator',name:'Board Foot Calculator'},{slug:'saw-kerf-calculator',name:'Saw Kerf Calculator'}],faq:[{question:'Are gaps included?',answer:'Yes. The row calculation explicitly includes spacing between boards.'},{question:'What does orientation change?',answer:'It swaps which deck dimension defines row length and which defines the number of rows.'},{question:'Should I enter nominal width?',answer:'No. Use the board’s actual face width.'}]})},
  'fence-calculator': {slug:'fence-calculator',...expansionPage({name:'Fence Calculator',description:'Estimate straight-run fence sections, panels, a minimum post count and optional rails.',keywords:['fence panel and post calculator','fence post spacing calculator','fence gate material estimate'],intro:'Turn a fence run into a preliminary material count while keeping gate openings and panel allowance explicit.',formula:'Gate widths are removed from fenced length; remaining length is divided into sections, and each gate creates another fence run for the minimum post count.',interpretation:'The post result is a straight-run planning lower bound because corner-leg lengths and gate positions are not entered.',limitations:['Exact multi-leg layouts require each leg and gate position to be taken off separately.','Irregular terrain, bracing assemblies, double gates and shared corner conditions may change counts.','Confirm property lines, utilities, frost depth, wind design and local requirements.'],relatedTools:[{slug:'post-hole-concrete-calculator',name:'Post Hole Concrete Calculator'},{slug:'construction-estimate-builder',name:'Construction Estimate Builder'}],faq:[{question:'Are gate widths subtracted?',answer:'Yes. Entered gate openings reduce the fenced length.'},{question:'What does panel mode do?',answer:'It applies the entered allowance to base sections and rounds only whole purchased panels.'},{question:'Is the post count an exact layout?',answer:'No. It is a straight-run lower bound; segment each real fence leg and locate gates for an exact takeoff.'}]})},
  'post-hole-concrete-calculator': {slug:'post-hole-concrete-calculator',...expansionPage({name:'Post Hole Concrete Calculator',description:'Calculate post-hole concrete after round or rectangular post displacement, with cubic yards and bags by entered yield.',keywords:['post hole concrete bag calculator','fence post concrete volume','post displacement concrete calculator'],intro:'Estimate only the annular concrete space between a cylindrical hole and the inserted post.',formula:'Net concrete = cylindrical hole volume − post volume, multiplied by the whole hole count.',interpretation:'Post displacement is reported separately and always reduces net concrete relative to an empty hole.',limitations:['Actual holes are rarely perfect cylinders and may widen or collapse.','Use manufacturer bag yield and local footing or frost-depth requirements.'],relatedTools:[{slug:'fence-calculator',name:'Fence Calculator'},{slug:'concrete-calculator',name:'Concrete Calculator'}],faq:[{question:'Does the post reduce concrete quantity?',answer:'Yes. Round and rectangular post displacement is subtracted.'},{question:'Can I enter bag yield?',answer:'Yes. Use the cured-volume yield printed by the concrete manufacturer.'},{question:'Are hole dimensions in inches?',answer:'Yes, while results convert to cubic feet and yards.'}]})},
  'drywall-calculator': {slug:'drywall-calculator',...expansionPage({name:'Drywall Calculator',description:'Estimate net drywall area, sheets, waste, screws, tape and compound from walls, ceilings and openings.',keywords:['drywall sheet calculator with openings','sheetrock material calculator','drywall screws tape compound estimate'],intro:'Plan sheet quantities from either wall dimensions or known area with optional ceiling and opening adjustments.',formula:'Net area = wall + ceiling − openings; sheets round up after applying waste to net area.',interpretation:'Screws, tape and compound are approximate planning allowances tied to sheet count or net area.',limitations:['Fastener schedules, finish level, framing spacing and board layout affect actual consumption.','Tape and compound allowances are approximate and should be checked against product coverage.'],relatedTools:[{slug:'construction-estimate-builder',name:'Construction Estimate Builder'},{slug:'paint-calculator',name:'Paint Calculator'}],faq:[{question:'Can I subtract doors and windows?',answer:'Yes. Enter their combined opening area.'},{question:'Can I include a ceiling?',answer:'Yes. Ceiling area is optional and added before openings are subtracted.'},{question:'Are screws exact?',answer:'No. They are a clearly labeled planning allowance.'}]})},
  'paver-calculator': {slug:'paver-calculator',...expansionPage({name:'Paver Calculator',description:'Calculate exact base paver quantity, allowance-adjusted quantity, whole units and pallets from project dimensions.',keywords:['patio paver calculator','paver count by size','pavers per pallet calculator'],intro:'Convert project area and individual paver dimensions into an unrounded material requirement and supplier quantities.',formula:'Exact pavers = project area ÷ paver face area; waste is applied to that exact value before whole pavers and pallets round upward.',interpretation:'Base geometry, allowance-adjusted quantity and whole-unit purchasing are reported separately.',limitations:['Joint spacing and pattern cuts are represented only through the waste allowance.','Verify actual packaged count, dimensions and pattern coverage with the supplier.'],relatedTools:[{slug:'polymeric-sand-calculator',name:'Polymeric Sand Calculator'},{slug:'sand-calculator',name:'Sand Calculator'}],faq:[{question:'Can I enter known area?',answer:'Yes, or calculate it from project length and width.'},{question:'Does it calculate pallets?',answer:'Yes when you enter the supplier’s pavers-per-pallet quantity.'},{question:'When is the count rounded?',answer:'Only after the waste allowance is applied to the exact geometric requirement.'}]})},
  'polymeric-sand-calculator': {slug:'polymeric-sand-calculator',...expansionPage({name:'Polymeric Sand Calculator',description:'Estimate repeated-grid joint volume, density-based polymeric sand weight and whole bags.',keywords:['polymeric sand calculator joint width','paver joint sand bag calculator','polymeric sand coverage estimate'],intro:'Model interior paver-joint fill with a repeated paver-plus-joint module, editable depth, density and allowance.',formula:'Joint plan area per module = repeated module area − paver face area; volume × density gives base mass before allowance.',interpretation:'Base mass, allowance-adjusted mass, exact bag equivalent and whole bags are reported separately.',limitations:['The repeating-grid approximation does not model edge joints, cuts or irregular patterns.','Manufacturer coverage varies with paver geometry, joint profile, compaction and product formulation.','Use the product data sheet whenever it provides a tested coverage table.'],relatedTools:[{slug:'paver-calculator',name:'Paver Calculator'},{slug:'sand-calculator',name:'Sand Calculator'}],faq:[{question:'Are crossing joints counted twice?',answer:'No. Joint area is the non-overlapping remainder of each repeated module.'},{question:'Can density be changed?',answer:'Yes. Override the planning density with product information.'},{question:'Is this a manufacturer coverage guarantee?',answer:'No. Product-specific coverage should control purchasing.'}]})},
  'mulch-calculator': {slug:'mulch-calculator',...expansionPage({name:'Mulch Calculator',description:'Calculate mulch cubic feet, cubic yards, liters and bag count for rectangular, circular or known-area beds.',keywords:['mulch cubic yard calculator','mulch depth bag calculator','circular mulch bed calculator'],intro:'Convert bed area and installed depth into bulk or bagged mulch quantities.',formula:'Volume = area × depth in feet; cubic yards = cubic feet ÷ 27.',interpretation:'For 100 square feet at 3 inches, the result is 25 ft³ or about 0.926 yd³.',limitations:['Settling, irregular grades and desired replenishment depth can change actual need.','Bag volumes should come from the product label.'],relatedTools:[{slug:'topsoil-calculator',name:'Topsoil Calculator'},{slug:'land-area-converter',name:'Land Area Converter'}],faq:[{question:'How much mulch for 100 ft² at 3 inches?',answer:'25 cubic feet, about 0.926 cubic yards.'},{question:'Can I calculate a circle?',answer:'Yes. In circle mode, the entered length is treated as diameter.'},{question:'Can I change bag size?',answer:'Yes. Enter bag volume in cubic feet.'}]})},
  'topsoil-calculator': {slug:'topsoil-calculator',...expansionPage({name:'Topsoil Calculator',description:'Calculate topsoil cubic feet, cubic yards, cubic meters and editable-density tonnage from area and depth.',keywords:['topsoil cubic yard calculator','soil depth volume calculator','topsoil tons calculator density'],intro:'Estimate loose topsoil volume and an optional weight range starting from measured coverage.',formula:'Volume = area × depth in feet; estimated short tons = cubic feet × entered lb/ft³ ÷ 2,000.',interpretation:'For 100 square feet at 3 inches, volume is 25 ft³ or about 0.926 yd³ before settlement.',limitations:['Moisture, composition, screening and compaction materially change density and delivered coverage.','Tonnage is only as reliable as the entered density.'],relatedTools:[{slug:'mulch-calculator',name:'Mulch Calculator'},{slug:'excavation-calculator',name:'Excavation Calculator'}],faq:[{question:'How much topsoil for 100 ft² at 3 inches?',answer:'25 cubic feet, about 0.926 cubic yards.'},{question:'Why is density editable?',answer:'Wet, dry, sandy and organic soils have different bulk weights.'},{question:'Does volume include compaction?',answer:'No. Add a project-specific settlement allowance if needed.'}]})},
  'osha-portable-toilet-calculator': {
    slug: 'osha-portable-toilet-calculator',
    name: 'OSHA Portable Toilet Calculator',
    category: 'Construction Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate construction-jobsite toilet fixture minimums from workforce size using the thresholds in OSHA 29 CFR 1926.51(c)(1), Table D-1.',
    longTailKeywords: [
      'osha portable toilet calculator',
      'osha toilet requirements construction',
      'portable toilets per worker',
      'construction toilet ratio',
      'osha porta potty requirements',
      'how many portable toilets construction site',
    ],
    intro: [
      'Estimate the numerical OSHA construction-jobsite sanitation minimum from the number of employees.',
      'The calculator separates the regulatory fixture ratio from portable-unit configuration so users do not assume every rental unit is identical.',
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
    description: 'Create an itemized construction estimate from materials, labor, equipment, subcontractors, overhead, contingency, markup, tax, and discount, with downloadable PDF and JPG output.',
    longTailKeywords: [
      'construction estimate template',
      'construction estimate builder',
      'construction estimate generator',
      'free construction estimate template',
      'construction cost estimate template',
      'itemized construction estimate'
    ],
    intro: [
      'Construction Estimate Builder lets you create a detailed project estimate from user-entered line items instead of relying on generic cost-per-square-foot assumptions.',
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
    description: 'Generate an itemized contractor estimate with business and customer details, line-item pricing, overhead, contingency, markup, tax, discount, terms, and downloadable PDF/JPG output.',
    longTailKeywords: [
      'contractor estimate template',
      'general contractor estimate template',
      'free contractor estimate template',
      'contractor estimate generator',
      'construction quote template',
      'contractor quote generator'
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
    steps: ['Choose metres or feet.', 'Enter room length, width, and wall height.', 'Enter wallpaper roll width and length.', 'Enter approximate door/window area and waste allowance.', 'Review recommended roll quantity.'],
    interpretation: ['The calculator checks both area coverage and the number of full-height strips available from each roll.', 'The larger roll requirement is used as the recommendation.'],
    limitations: ['Pattern repeats, matching, trimming, damaged sections, irregular walls, alcoves, and complex openings may increase material usage.', 'Measure actual wallpaper roll dimensions rather than assuming all products use the same size.'],
    faqs: [
      { question: 'How many wallpaper rolls do I need?', answer: 'Enter your room and roll measurements; the calculator estimates both wall area and full-height strip requirements.' },
      { question: 'Should I include waste?', answer: 'Yes. A waste allowance helps account for trimming, errors, and pattern matching.' },
      { question: 'Should doors and windows be deducted?', answer: 'They can be entered as an approximate combined area.' },
    ],
    relatedTools: [
      { slug: 'paint-calculator', name: 'Paint Calculator' },
      { slug: 'flooring-calculator', name: 'Flooring Calculator' },
      { slug: 'tile-calculator', name: 'Tile Calculator' },
    ],
    relatedGuides: [],
  },
  'construction-cost-calculator': {
    slug: 'construction-cost-calculator', name: 'Construction Cost Calculator with Direct Rate and Contingency', category: 'Construction Calculators', applicationCategory: 'FinanceApplication', description: 'Estimate project cost from area, a user-entered direct USD rate, labor/material allocation weights, overhead, and contingency without double-counting direct costs.',
    longTailKeywords: ['construction cost calculator custom rate', 'building cost per square foot calculator', 'construction overhead contingency calculator', 'labor material cost allocation calculator', 'project cost estimate square meters to square feet'],
    intro: ['The calculator converts area to square feet and multiplies it by a user-entered direct construction rate.', 'Labor and material weights allocate that direct cost rather than being added to it. Overhead is added to direct cost, then contingency is applied to the subtotal.'],
    formula: [{ title: 'Direct cost', body: 'Area in ft² × entered USD direct rate per ft².' }, { title: 'Total', body: '(Direct cost + overhead) × (1 + contingency percentage ÷ 100).' }],
    steps: ['Enter project area and a current scope-specific direct rate.', 'Use labor and material values only as relative allocation weights.', 'Enter overhead and contingency assumptions and reconcile every inclusion with a professional estimate.'],
    interpretation: ['The labor and material breakdown always sums to direct cost when their combined weight is positive.', 'All displayed money is USD and no market pricing is supplied by Navorika.'], limitations: ['Arithmetic planning tool only; accuracy depends entirely on entered scope and rates.', 'Excludes any item not included by the user in direct rate or overhead, including taxes, escalation, design, financing, land, abnormal site conditions, and change orders.', 'Not a bid, valuation, budget approval, or cost-professional estimate.'],
    faqs: [{ question: 'Are labor and materials added to base cost?', answer: 'No. They allocate the direct cost to avoid double-counting.' }, { question: 'Are rates current?', answer: 'No rates are provided; enter a current project-specific rate.' }, { question: 'What currency is used?', answer: 'US dollars.' }, { question: 'When is contingency applied?', answer: 'After adding entered overhead to direct cost.' }],
    relatedTools: [{ slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' }, { slug: 'flooring-calculator', name: 'Flooring Calculator' }, { slug: 'paint-calculator', name: 'Paint Calculator' }], relatedGuides: ['construction-estimate-quote-guide', 'house-construction-cost-guide'],
  },
  'house-construction-cost-calculator': {
    slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator with Custom Rates', category: 'Construction Calculators', applicationCategory: 'FinanceApplication', description: 'Estimate house project cost from floor area, floor count, a custom USD construction rate, site and soft costs, contingency, and optional land cost.',
    longTailKeywords: ['house construction cost calculator custom rate', 'home building cost per square foot calculator', 'multi floor house cost estimator', 'construction contingency and land cost calculator', 'house project cost excluding land'],
    intro: ['This transparent estimator multiplies area per floor by floor count and a user-entered construction rate.', 'It separately adds contingency, site and soft costs, and optional land cost instead of inventing location-independent quality prices.'],
    formula: [{ title: 'Direct construction', body: 'Area per floor in ft² × number of floors × entered USD rate per ft².' }, { title: 'Total project', body: 'Direct construction + contingency + site/soft allowance + land cost.' }],
    steps: ['Enter gross area per floor and the number of similar floors.', 'Enter a current USD rate whose inclusions are clearly defined.', 'Add project-specific site/soft costs, contingency, and land cost, then validate against detailed estimates.'],
    interpretation: ['Cost per square foot excluding land includes direct work, contingency, and site/soft allowance.', 'Land remains a separate fixed input because it is not proportional to constructed floor area.'], limitations: ['Does not supply market rates or infer quality, location, specification, procurement route, or schedule.', 'Does not itemize design, permits, utilities, financing, taxes, escalation, demolition, abnormal ground, landscaping, interiors, or owner costs unless entered in allowances.', 'Not a quotation, valuation, or lending decision tool.'],
    faqs: [{ question: 'Does Navorika choose a construction rate?', answer: 'No. You must enter a current rate for the defined scope.' }, { question: 'Is the entered area total area?', answer: 'It is area per floor and is multiplied by floor count.' }, { question: 'Is land included in cost per square foot?', answer: 'No. The displayed construction cost per ft² excludes land.' }, { question: 'Are soft costs itemized?', answer: 'No. They are one user-entered allowance.' }],
    relatedTools: [{ slug: 'brick-calculator', name: 'Brick Calculator' }, { slug: 'cement-calculator', name: 'Cement Calculator' }, { slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'flooring-calculator', name: 'Flooring Calculator' }, { slug: 'roof-area-calculator', name: 'Roof Area Calculator' }], relatedGuides: ['house-construction-cost-guide', 'construction-estimate-quote-guide'],
  },
  'voltage-drop-calculator': {
    slug: 'voltage-drop-calculator', name: 'Copper Wire Voltage Drop Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate resistive voltage drop for copper AWG conductors from voltage, current, one-way length, gauge, and single-phase/DC or three-phase geometry.',
    longTailKeywords: ['copper wire voltage drop calculator AWG', 'single phase voltage drop one way length', 'three phase voltage drop calculator copper', '12 volt DC wire voltage drop calculator', 'electrical cable voltage drop percentage'],
    intro: ['The calculator uses approximate copper DC resistance per metre at 20°C and treats entered route length as one-way length.', 'Single-phase or DC uses the two-conductor loop factor; balanced three-phase uses the square-root-of-three factor.'],
    formula: [{ title: 'Single-phase or DC', body: '2 × current × resistance per metre × one-way length.' }, { title: 'Balanced three-phase', body: '√3 × current × resistance per metre × one-way length.' }],
    steps: ['Enter operating voltage, current, and one-way conductor route length.', 'Choose the copper AWG size and correct circuit geometry.', 'Compare with a user-entered planning limit, then obtain a code-compliant professional design.'],
    interpretation: ['Percentage drop equals calculated volts divided by entered nominal voltage.', 'The status only compares with the entered planning limit; it is not a code-compliance determination.'], limitations: ['Simplified resistive estimate using approximate 20°C copper values.', 'Does not model conductor operating temperature, AC reactance, power factor, harmonics, parallel conductors, connections, starting current, ampacity, protection, or installation rules.', 'Never use it as the sole basis for electrical design or conductor selection.'],
    faqs: [{ question: 'Is length one-way or round-trip?', answer: 'Enter one-way route length; the formula applies the proper geometry factor.' }, { question: 'Does it support aluminum?', answer: 'No, this page models copper only.' }, { question: 'Does “within limit” mean code compliant?', answer: 'No.' }, { question: 'Why can real drop differ?', answer: 'Resistance changes with temperature and AC circuits can include reactance and power-factor effects.' }],
    relatedTools: [{ slug: 'wire-size-calculator', name: 'Wire Size Calculator' }, { slug: 'solar-panel-calculator', name: 'Solar Panel Calculator' }, { slug: 'steel-weight-calculator', name: 'Steel Weight Calculator' }], relatedGuides: [],
  },
  'wire-size-calculator': {
    slug: 'wire-size-calculator', name: 'Preliminary AWG Wire Size Reference Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Find the first AWG reference size meeting user-entered design-current and voltage-drop criteria using simplified copper or aluminum ampacity and resistance tables.',
    longTailKeywords: ['AWG wire size calculator voltage drop ampacity', 'copper aluminum wire gauge calculator', 'wire size calculator one way length', 'single phase three phase cable size reference', 'electrical conductor load factor calculator'],
    intro: ['The calculator increases operating current by the entered design-load factor, then checks AWG sizes in order against simplified reference ampacity and voltage drop.', 'It uses one-way route length, approximate 20°C resistance, and separate copper/aluminum reference values.'],
    formula: [{ title: 'Design current', body: 'Operating current × entered load factor percentage ÷ 100.' }, { title: 'Qualification', body: 'Reference ampacity ≥ design current and estimated voltage drop ≤ entered limit.' }],
    steps: ['Enter operating current, voltage, one-way route length, conductor material, and phase geometry.', 'Set the design-load factor and voltage-drop planning limit required by the project basis.', 'Treat the result only as a starting reference and have a qualified professional perform the complete code calculation.'],
    interpretation: ['The first size meeting both simplified checks is shown.', 'If 4/0 fails either check, the result explicitly reports that the available table is insufficient.'], limitations: ['Not an electrical design, code lookup, or installation approval.', 'Reference ampacity depends on jurisdiction, conductor type, insulation, terminals, temperature, grouping, raceway, cable construction, and installation method.', 'Voltage-drop model omits reactance, power factor, harmonics, connections, motor starting, fault current, and parallel conductors.'],
    faqs: [{ question: 'Does the calculator use length?', answer: 'Yes, as one-way route length in the voltage-drop check.' }, { question: 'Does it use voltage and phase?', answer: 'Yes.' }, { question: 'What is the load factor?', answer: 'A user-entered multiplier applied to operating current for preliminary screening.' }, { question: 'Can I install the displayed size?', answer: 'Not without a complete professional code-compliant design.' }],
    relatedTools: [{ slug: 'voltage-drop-calculator', name: 'Voltage Drop Calculator' }, { slug: 'solar-panel-calculator', name: 'Solar Panel Calculator' }, { slug: 'construction-cost-calculator', name: 'Construction Cost Calculator' }], relatedGuides: [],
  },
  'rebar-calculator': {
    slug: 'rebar-calculator', name: 'Slab Rebar Grid Quantity and Weight Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate straight rebar counts, total length, and theoretical mass for a rectangular slab grid using clear cover, maximum spacing, bar diameter, and reinforcement direction.',
    longTailKeywords: ['slab rebar grid calculator', 'rebar spacing quantity calculator', 'reinforcing bar weight calculator slab', 'rebar length both directions calculator', 'metric rebar quantity estimator'],
    intro: ['The tool reduces slab dimensions by twice the entered edge cover, then rounds interval counts upward so calculated spacing does not exceed the entered maximum.', 'Straight bar length is multiplied by standard theoretical mass per metre for the selected nominal diameter.'],
    formula: [{ title: 'Bars across a dimension', body: 'Ceiling(effective dimension ÷ maximum spacing) + 1.' }, { title: 'Total mass', body: 'Total straight-bar length × theoretical kg/m for the selected diameter.' }],
    steps: ['Enter slab plan dimensions, nominal bar size, specified maximum spacing, and edge cover.', 'Choose one or both orthogonal reinforcement directions.', 'Add design-specific laps, anchorage, hooks, layers, supports, trimming bars, openings, and waste outside this estimate.'],
    interpretation: ['The entered spacing is treated as a maximum, not an exact achieved spacing.', 'Total bars counts straight grid lines, not commercial stock lengths or fabricated pieces.'], limitations: ['Not a reinforcement design or bar-bending schedule.', 'Assumes one flat rectangular layer with straight full-length bars and uniform cover.', 'Does not verify structural capacity, code minimums, development length, lap zones, congestion, tolerances, or constructability.'],
    faqs: [{ question: 'Why are intervals rounded upward?', answer: 'Rounding downward could produce spacing greater than the entered maximum.' }, { question: 'Are laps included?', answer: 'No.' }, { question: 'Does “both directions” include two layers?', answer: 'No. It means two perpendicular directions in one idealized layer.' }, { question: 'Can this size reinforcement?', answer: 'No. Bar size and spacing must come from an approved design.' }],
    relatedTools: [{ slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'steel-weight-calculator', name: 'Steel Weight Calculator' }, { slug: 'cement-calculator', name: 'Cement Calculator' }], relatedGuides: [],
  },
  'excavation-calculator': {
    slug: 'excavation-calculator', name: 'Excavation Bank Volume, Swell and Haul Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate rectangular bank excavation volume, loose volume after a custom swell allowance, material mass from loose density, and loads from a custom truck payload.',
    longTailKeywords: ['excavation volume swell calculator', 'bank cubic meters to loose volume', 'excavated soil truck load calculator', 'earthwork volume weight calculator', 'excavation haul estimate custom density'],
    intro: ['This estimator calculates in-place rectangular volume and applies a user-entered swell percentage to estimate loose hauled volume.', 'Loose density converts that expanded volume to mass, which is divided by the entered lawful truck payload and rounded upward.'],
    formula: [{ title: 'Bank volume', body: 'Length × width × depth after conversion to metres.' }, { title: 'Loose volume', body: 'Bank volume × (1 + swell percentage ÷ 100).' }, { title: 'Loads', body: 'Loose volume × loose density ÷ truck payload, rounded upward.' }],
    steps: ['Measure the designed excavation and select metres or feet.', 'Obtain representative swell and loose-density values from geotechnical or project information.', 'Enter the actual lawful payload for the hauling vehicle and reconcile with site conditions.'],
    interpretation: ['Bank volume is material before excavation; loose volume is the expanded hauled estimate.', 'Load count is mass-limited only and does not check truck volumetric capacity.'], limitations: ['Assumes a rectangular excavation with uniform depth.', 'Does not include side slopes, benches, shoring clearance, working space, overbreak, groundwater, unsuitable material, access, volume-limited trucks, or axle restrictions.', 'Density and swell are project-specific and can vary substantially.'],
    faqs: [{ question: 'What is swell?', answer: 'The percentage increase in material volume after it is excavated and loosened.' }, { question: 'Which density should I use?', answer: 'Use loose hauled density for the actual material and moisture condition.' }, { question: 'Are loads volume-checked?', answer: 'No. The calculator only divides estimated mass by payload.' }, { question: 'Does it design safe slopes?', answer: 'No.' }],
    relatedTools: [{ slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: [],
  },
  'roof-area-calculator': {
    slug: 'roof-area-calculator', name: 'Simple Pitched Roof Area Calculator with Waste', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate surface area for a simple uniformly pitched roof from plan dimensions, rise-per-12 pitch, same-unit overhang, and a custom waste allowance.',
    longTailKeywords: ['pitched roof area calculator with waste', 'roof pitch factor calculator rise over 12', 'roof square calculator metric imperial', 'gable roof surface area estimator', 'roofing area with overhang calculator'],
    intro: ['The calculator expands plan length and width by the entered overhang on both sides, then multiplies plan area by the slope factor for a rise-per-12 pitch.', 'A custom waste percentage produces an order area and equivalent roofing squares of 100 square feet.'],
    formula: [{ title: 'Pitch factor', body: 'Square root of 1 + (rise ÷ 12)².' }, { title: 'Roof surface', body: 'Expanded plan length × expanded plan width × pitch factor.' }, { title: 'Order area', body: 'Roof surface × (1 + waste percentage ÷ 100).' }],
    steps: ['Select metres or feet and enter horizontal building dimensions.', 'Enter overhang in that same selected unit and roof rise per 12 units of horizontal run.', 'Set waste for the actual roof geometry and confirm coverage with the roofing manufacturer.'],
    interpretation: ['One roofing square equals 100 ft² or 9.290304 m².', 'The model treats the entire roof as one uniform pitch over a rectangular plan.'], limitations: ['Not suitable for complex hips, valleys, dormers, intersecting roofs, curved roofs, or varying slopes without separate takeoffs.', 'Does not calculate bundles, ridge, hip, starter, flashing, underlayment, fasteners, penetrations, or ventilation.', 'Plan dimensions and overhang must be horizontal measurements.'],
    faqs: [{ question: 'What does 4/12 pitch mean?', answer: 'Four units of vertical rise for every twelve units of horizontal run.' }, { question: 'What unit is overhang?', answer: 'It follows the selected building unit.' }, { question: 'Are bundles calculated?', answer: 'No, because coverage per bundle varies by product.' }, { question: 'Does waste include ridge materials?', answer: 'No. It only increases surface order area.' }],
    relatedTools: [{ slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' }, { slug: 'solar-panel-calculator', name: 'Solar Panel Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: ['how-to-calculate-roof-area', 'house-construction-cost-guide'],
  },
  'tile-calculator': {
    slug: 'tile-calculator', name: 'Rectangular Tile Grid Calculator with Joint Gap and Waste', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate a fixed-orientation rectangular tile grid, custom waste allowance, whole tiles, and boxes from entered packaging.',
    longTailKeywords: ['tile calculator with grout gap', 'floor tile grid quantity calculator', 'tiles needed with waste percentage', 'metric imperial tile calculator', 'tile rows columns calculator'],
    intro: ['The calculator converts room and tile dimensions to metres, then calculates whole tile positions along each direction using the entered joint gap.', 'The fitted rectangular grid is multiplied by the waste percentage once and rounded upward.'],
    formula: [{ title: 'Tiles along a side', body: 'Ceiling((room side + joint gap) ÷ (tile side + joint gap)).' }, { title: 'Fitted grid', body: 'Tiles along length × tiles along width.' }, { title: 'Order quantity', body: 'Fitted grid × (1 + waste percentage ÷ 100), rounded upward to whole tiles; boxes use entered tiles per box.' }],
    steps: ['Enter rectangular coverage dimensions and select metres or feet.', 'Enter actual tile dimensions in centimetres or inches and the planned joint gap in millimetres.', 'Set waste for layout and cuts, then convert tiles to boxes using actual manufacturer packaging.'],
    interpretation: ['The result assumes one fixed tile orientation and shows grid dimensions before waste.', 'Waste is included once; whole tiles and boxes round only at their purchase stages.'], limitations: ['Does not optimize alternate orientation, pattern, stagger, diagonal layout, borders, niches, obstacles, or reuse of offcuts.', 'Assumes uniform joints and a rectangular coverage area.', 'Box count is valid only for the supplier package quantity entered.'],
    faqs: [{ question: 'Does joint gap affect the result?', answer: 'Yes. It is included in the repeated tile pitch.' }, { question: 'Is waste added twice?', answer: 'No.' }, { question: 'How are boxes calculated?', answer: 'Whole tiles are divided by the entered supplier package quantity and rounded upward.' }, { question: 'Does this optimize cuts?', answer: 'No.' }],
    relatedTools: [{ slug: 'flooring-calculator', name: 'Flooring Calculator' }, { slug: 'paint-calculator', name: 'Paint Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: [],
  },
  'brick-calculator': {
    slug: 'brick-calculator', name: 'Brick Quantity Calculator with Mortar and Waste', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate bricks for a rectangular wall from length, height, thickness, nominal brick dimensions, mortar-joint thickness, and a custom waste percentage.',
    longTailKeywords: ['brick calculator with wall thickness', 'bricks per cubic meter calculator', 'brick wall quantity calculator with mortar', 'standard brick quantity estimator', 'brick calculator with waste percentage'],
    intro: ['The calculator divides rectangular wall volume by the nominal volume occupied by one brick plus mortar joints in all three dimensions.', 'It then applies the entered waste percentage once and rounds upward to a whole brick.'],
    formula: [{ title: 'Wall volume', body: 'Wall length × wall height × wall thickness.' }, { title: 'Brick count', body: 'Wall volume ÷ nominal brick-and-joint volume × (1 + waste percentage ÷ 100), rounded upward.' }],
    steps: ['Measure net wall length, height, and constructed thickness in the selected unit.', 'Choose the available brick size and enter the planned mortar-joint thickness.', 'Subtract openings from the project separately and confirm bond and wall build-up with drawings.'],
    interpretation: ['Nominal bricks per cubic metre includes a mortar joint around each idealized brick.', 'The result already includes the entered waste percentage.'], limitations: ['Assumes a solid rectangular wall and uniform joints.', 'Does not subtract doors, windows, bond effects, partial units, piers, reinforcement, cavities, insulation, or movement joints.', 'Actual brick dimensions, frog volume, workmanship, breakage, and supplier pack quantities vary.'],
    faqs: [{ question: 'Does wall thickness affect the result?', answer: 'Yes. It is included directly in wall volume.' }, { question: 'Is waste added twice?', answer: 'No. The entered percentage is applied once.' }, { question: 'Are openings deducted?', answer: 'No. Calculate net wall volume or deduct openings separately.' }, { question: 'Can this replace a masonry takeoff?', answer: 'No. Confirm quantities against project drawings and the selected masonry system.' }],
    relatedTools: [{ slug: 'house-construction-cost-calculator', name: 'House Construction Cost Calculator' }, { slug: 'cement-calculator', name: 'Cement Calculator' }, { slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }], relatedGuides: ['brick-calculation-guide', 'house-construction-cost-guide'],
  },
  'cement-calculator': {
    slug: 'cement-calculator', name: 'Nominal Concrete Cement, Sand and Aggregate Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate nominal cement bags, cement mass, sand volume, and aggregate volume from wet concrete volume using a stated dry-volume factor and selected volumetric mix ratio.',
    longTailKeywords: ['cement bags per cubic meter calculator', 'cement sand aggregate ratio calculator', 'concrete dry volume factor calculator', '1 1.5 3 cement quantity calculator', 'cubic yard concrete cement bags estimate'],
    intro: ['This planning calculator converts wet concrete volume to cubic metres, multiplies it by a stated 1.54 dry-material factor, and divides that volume by the selected nominal mix parts.', 'Cement mass uses an assumed bulk density of 1,440 kg/m³ and bag count is rounded upward.'],
    formula: [{ title: 'Dry volume', body: 'Wet finished volume × 1.54.' }, { title: 'Material volume', body: 'Dry volume × material parts ÷ total mix parts.' }, { title: 'Cement bags', body: 'Cement volume × 1,440 kg/m³ ÷ selected bag mass, rounded upward.' }],
    steps: ['Enter the required finished concrete volume and correct cubic unit.', 'Select only a nominal ratio approved for preliminary estimating and choose the actual bag mass.', 'Confirm the engineered batch design, moisture corrections, yield, and waste before procurement.'],
    interpretation: ['Cubic yards and cubic feet are converted to cubic metres before calculation.', 'Sand and aggregate outputs are dry nominal volumes, not guaranteed delivered quantities.'], limitations: ['A fixed dry-volume factor and cement bulk density are approximations.', 'Nominal volumetric ratios do not establish strength, durability, workability, or code compliance.', 'Does not account for moisture, bulking, aggregate grading, admixtures, air, site waste, or measured batch yield.'],
    faqs: [{ question: 'Why is dry volume greater than finished concrete volume?', answer: 'Separate dry ingredients contain voids that reduce after mixing and compaction; 1.54 is an explicit planning assumption.' }, { question: 'Are cement bags rounded?', answer: 'Yes, upward to a whole selected-size bag.' }, { question: 'Is 1:1.5:3 automatically M20 concrete?', answer: 'No. Required performance must be established and verified by an approved mix design.' }, { question: 'Is waste included?', answer: 'No separate waste percentage is included.' }],
    relatedTools: [{ slug: 'concrete-calculator', name: 'Concrete Calculator' }, { slug: 'brick-calculator', name: 'Brick Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }], relatedGuides: [],
  },
  'concrete-calculator': {
    slug: 'concrete-calculator', name: 'Concrete Volume and Nominal Material Mix Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate rectangular wet concrete volume with waste and nominal 1:1.5:3 dry material volumes, including water derived from a stated cement mass ratio.',
    longTailKeywords: ['concrete volume calculator with waste', '1 1.5 3 concrete material calculator', 'concrete cement sand aggregate calculator', 'concrete water cement ratio liters calculator', 'slab concrete cubic meter calculator'],
    intro: ['This tool calculates rectangular finished concrete volume, applies the selected waste percentage, and converts it to dry material volume using a 1.54 factor.', 'The nominal 1:1.5:3 volumes are divided from dry volume. Water is calculated at 0.45 times assumed cement mass and reported in litres.'],
    formula: [{ title: 'Order volume', body: 'Length × width × thickness × (1 + waste percentage ÷ 100).' }, { title: 'Dry materials', body: 'Order volume × 1.54, divided into 1:1.5:3 volumetric parts.' }, { title: 'Water', body: 'Cement volume × 1,440 kg/m³ × 0.45, expressed as litres.' }],
    steps: ['Enter rectangular dimensions using metres or feet and a project-specific waste percentage.', 'Review finished order volume separately from nominal dry ingredient volumes.', 'Use an engineered mix design and field moisture corrections for actual batching.'],
    interpretation: ['Concrete volume includes the entered waste allowance.', 'Ingredient figures are nominal planning quantities and water is based on assumed cement bulk density.'], limitations: ['Not a structural mix design and does not guarantee any strength class.', 'Does not model reinforcement displacement, irregular geometry, subgrade variation, moisture, aggregate absorption, admixtures, entrained air, slump, or batch yield.', 'Never use the water result without correcting for aggregate moisture and the approved mix specification.'],
    faqs: [{ question: 'Is this an M20 design?', answer: 'No. A nominal ratio is not a verified strength or durability design.' }, { question: 'Does volume include waste?', answer: 'Yes, using the entered percentage.' }, { question: 'Why is water reported in litres?', answer: 'The water–cement ratio is mass-based; one litre of water is approximately one kilogram for planning.' }, { question: 'Can I batch directly from these values?', answer: 'No. Use an approved mix design and site measurements.' }],
    relatedTools: [{ slug: 'cement-calculator', name: 'Cement Calculator' }, { slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'rebar-calculator', name: 'Rebar Calculator' }], relatedGuides: [],
  },
  'solar-panel-calculator': {
    slug: 'solar-panel-calculator', name: 'Preliminary Solar Panel System Size Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate nominal photovoltaic array size and panel count from average daily energy use, peak sun hours, panel wattage, and an overall system-loss percentage.',
    longTailKeywords: ['solar panel count calculator from daily kwh', 'home solar system size calculator kw', 'solar array calculator peak sun hours', 'solar panels needed for daily energy use', 'PV panel calculator with system losses'],
    intro: ['This preliminary calculator balances average daily consumption against user-entered peak sun hours after applying an overall loss percentage.', 'It rounds panel count upward, then estimates annual production from the resulting nominal array size using the same daily solar-resource assumption.'],
    formula: [{ title: 'Required array', body: 'Daily kWh ÷ peak sun hours ÷ (1 − loss percentage ÷ 100).' }, { title: 'Panel count', body: 'Required array watts ÷ panel watts, rounded upward.' }],
    steps: ['Use representative average daily consumption from utility or monitoring data.', 'Enter location- and orientation-appropriate peak sun hours and a realistic total loss estimate.', 'Choose panel nameplate wattage, then obtain a site-specific professional design.'],
    interpretation: ['Nominal kW is panel nameplate capacity, not continuous output.', 'Annual production assumes every day has the entered average peak sun hours and loss rate.'], limitations: ['Not a quotation, savings forecast, electrical design, structural assessment, or permit document.', 'Does not model monthly weather, shading, azimuth, tilt, temperature, snow, degradation, inverter clipping, battery losses, export limits, downtime, or load timing.', 'Peak sun hours are not daylight hours and must come from credible site-specific solar data.'],
    faqs: [{ question: 'What are peak sun hours?', answer: 'They express daily solar energy as equivalent hours at 1,000 W/m², not the number of daylight hours.' }, { question: 'Why is panel count rounded up?', answer: 'A fractional physical panel cannot be installed.' }, { question: 'Does this size a battery?', answer: 'No.' }, { question: 'Is annual production bankable?', answer: 'No. It is a simplified extrapolation from the entered average assumptions.' }],
    relatedTools: [{ slug: 'steel-weight-calculator', name: 'Steel Weight Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }, { slug: 'water-tank-calculator', name: 'Water Tank Calculator' }], relatedGuides: [],
  },
  'steel-weight-calculator': {
    slug: 'steel-weight-calculator', name: 'Steel Bar and Ideal Section Weight Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate theoretical mass for solid round, square, and rectangular steel bars or a simplified sharp-edged I-section using dimensions, length, quantity, and editable density.',
    longTailKeywords: ['steel bar weight calculator kg per meter', 'round steel rod weight calculator', 'rectangular steel bar mass calculator', 'square steel bar weight calculator', 'simplified I beam weight calculator'],
    intro: ['This calculator multiplies an ideal cross-sectional area by the entered steel density, total length, and quantity; 7,850 kg/m³ is the default.', 'Round, square, and rectangular options model solid bars. The I-section option uses one thickness for both flanges and the web and treats the entered web height as the clear web height.'],
    formula: [{ title: 'Linear mass', body: 'Cross-sectional area in m² × entered density in kg/m³.' }, { title: 'Total mass', body: 'Linear mass × length per piece × quantity.' }],
    steps: ['Choose the idealized section and enter dimensions in millimetres.', 'Enter length per piece in metres and the number of identical pieces.', 'Use manufacturer or mill tables for procurement and structural work.'],
    interpretation: ['Results are theoretical masses for exact geometric dimensions.', '“Tons” means metric tonnes of 1,000 kg.'], limitations: ['Does not model dimensional tolerance, rounded corners, fillets, taper, holes, coatings, corrosion, or fabrication.', 'The I-section is simplified and is not a substitute for a standardized profile table.', 'Density varies by alloy; do not use this estimator for structural design, lifting plans, transport limits, or certification.'],
    faqs: [{ question: 'What steel density is used?', answer: 'The field defaults to 7,850 kg/m³ and can be replaced with the applicable alloy value.' }, { question: 'Does the I-section match catalog beams?', answer: 'Not necessarily; it is simplified ideal geometry.' }, { question: 'Is length entered per piece?', answer: 'Yes. Total length equals entered length multiplied by quantity.' }, { question: 'Should I order from this result?', answer: 'Verify actual section mass and tolerances in supplier data.' }],
    relatedTools: [{ slug: 'sand-calculator', name: 'Sand Calculator' }, { slug: 'gravel-calculator', name: 'Gravel Calculator' }, { slug: 'land-area-converter', name: 'Land Area Converter' }], relatedGuides: [],
  },
  'flooring-calculator': {
    slug: 'flooring-calculator', name: 'Flooring Area and Cost Calculator', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Estimate rectangular flooring order area, material cost, and installation labor from room dimensions, custom rates, and a waste percentage.',
    longTailKeywords: ['flooring cost calculator per square foot', 'flooring material waste calculator', 'room flooring square feet calculator', 'laminate flooring cost estimate', 'hardwood flooring material and labor calculator'],
    intro: ['The flooring calculator converts room dimensions to square feet, adds the selected material waste percentage, and applies editable US-dollar rates.', 'Material cost uses the enlarged order area; labor cost uses the measured floor area rather than charging labor on unused waste.'],
    formula: [{ title: 'Order area', body: 'Room square feet × (1 + waste percentage ÷ 100).' }, { title: 'Estimated cost', body: 'Order area × material rate + measured area × labor rate.' }],
    steps: ['Measure the rectangular floor and select metres or feet.', 'Enter current material and labor rates in US dollars per square foot.', 'Choose a project-specific waste allowance and verify the estimate against quotes.'],
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
    slug: 'water-tank-calculator', name: 'Water Tank Capacity Calculator by Shape', category: 'Construction Calculators', applicationCategory: 'UtilitiesApplication', description: 'Calculate theoretical rectangular, cylindrical, or spherical tank capacity in cubic metres, litres, and US gallons from metric or imperial dimensions.',
    longTailKeywords: ['water tank capacity calculator liters', 'rectangular tank volume calculator', 'cylindrical water tank capacity calculator', 'spherical tank volume calculator', 'tank cubic meters to US gallons'],
    intro: ['This calculator applies standard geometric volume formulas after converting feet to metres when needed.', 'It reports theoretical internal volume in cubic metres, litres, and US liquid gallons.'],
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
};
