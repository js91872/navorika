import type { GuideContent, GuideFAQ, GuideSection } from './guideContent';

function article(slug: string, headline: string, description: string, intro: string, sections: GuideSection[], faqs: GuideFAQ[], summary: string, datePublished?: string, dateModified?: string): GuideContent {
  const isSept2026 = slug.startsWith('batch-2026-09') || slug.startsWith('gsc-2026-09');
  return {
    intro, sections, faqs, summary,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      author: { '@type': 'Organization', name: 'Navorika' },
      datePublished: datePublished ?? (isSept2026 ? '2026-09-27' : slug.startsWith('new-') ? '2026-08-29' : '2026-08-01'),
      dateModified: dateModified ?? (isSept2026 ? '2026-09-27' : '2026-08-29'),
    },
  };
}

export const gscGuideContent: Record<string, GuideContent> = {
  'house-construction-cost-guide': article('new-house', 'How to Estimate House Construction Cost', 'A scope-first method for estimating house construction cost.',
    'A house construction cost estimate starts with a defined scope, measured built-up area, and current local rates. A cost-per-area result is useful for early feasibility, but it is not a bill of quantities, contractor quotation, or substitute for a quantity surveyor. The useful question is not only “what is the price per square foot?” but “what work, quality, location, and risk does that rate include?”', [
      { title: 'Start with built-up area and a defined scope', content: 'For an early area-based estimate:\n\nBase construction cost = total built-up area × construction rate per unit area\n\nUse the same unit on both sides: square feet with cost per square foot, or square metres with cost per square metre. Total built-up area normally includes the floor area of every included level; it is not automatically the plot area, carpet area, or a planning-authority measurement. Record whether balconies, garages, basements, external works, services, professional fees, permits, and land are included. Two rates cannot be compared fairly when their scopes differ.' },
      { title: 'Separate structure, services, and finishes', content: 'A transparent estimate groups work rather than hiding everything inside one rate. Typical groups include site preparation and foundations; structural frame or load-bearing work; walls and roofing; plumbing and electrical services; doors and windows; plastering and waterproofing; flooring, painting, fixtures, and other finishes. Material and labour costs should be visible where possible. Specification level matters: structural safety requirements are not optional “quality upgrades,” while finish selections can change cost substantially without changing floor area.' },
      { title: 'Location, procurement, wastage, and contractor margin', content: 'Labour availability, transport distance, access, soil conditions, climate, codes, permit processes, and supplier competition make construction costs local. Material wastage should be based on the material and installation method rather than one blanket percentage. Contractor overhead and margin pay for supervision, administration, equipment, insurance, risk, and profit; they should not be confused with contingency. Obtain current written supplier and contractor quotations instead of treating an online price as a local market rate.' },
      { title: 'Contingency and a worked planning example', content: 'Suppose a two-level house has 1,800 ft² of total built-up area and the user enters an illustrative rate of 150 currency units per ft². Base cost is 1,800 × 150 = 270,000. If clearly scoped site and soft costs total 22,000, the subtotal is 292,000. An illustrative 8% contingency applied to that subtotal is 23,360, producing an early planning total of 315,360 before any excluded land or financing cost. These numbers demonstrate the method only; they are not current prices or a recommendation for any region.' },
      { title: 'How to use the House Construction Cost Calculator', content: 'Enter the measured floor area, number of floors as the tool defines it, and a current custom construction rate. Add only site costs, professional or soft costs, contingency, and land cost that belong in your chosen scope. Review the result, then run low, middle, and high scenarios. Use the Construction Cost Calculator for a broader component view and the Construction Estimate Builder when you have actual quantities and line-item rates. Confirm the final scope, quantities, structural design, taxes, and contract terms with qualified local professionals.' },
      { title: 'Common estimating mistakes', content: 'Common errors include multiplying plot area instead of built-up area; counting some floors twice; comparing inclusive and exclusive rates; omitting services or external work; applying contingency to land unintentionally; using outdated rates; and adding wastage, overhead, markup, and contingency more than once. Keep an assumptions sheet beside every estimate so a later revision explains what changed.' },
    ], [
      { question: 'Is cost per square foot enough for a final budget?', answer: 'No. It is an early benchmark. A final budget needs project drawings, quantities, specifications, local rates, risk allowances, and a defined procurement scope.' },
      { question: 'Should land be included in construction cost?', answer: 'Usually it is shown separately so building cost can be compared consistently, but reporting conventions vary. Label it explicitly.' },
      { question: 'Are contingency and contractor margin the same?', answer: 'No. Contingency covers defined uncertainty; contractor margin is part of the contractor’s commercial price. Avoid double-counting either.' },
      { question: 'Does the calculator replace a contractor quotation?', answer: 'No. It organizes user-entered assumptions for early planning and cannot inspect the site or price a complete local scope.' },
    ], 'Use area-based cost as a transparent first scenario, then replace broad assumptions with measured quantities, written specifications, and current local quotations.'),

  'water-tank-size-capacity-guide': article('new-water', 'Water Tank Size & Capacity Calculation Guide', 'Calculate theoretical and usable tank volume safely.',
    'Tank sizing has two distinct parts: calculating geometric volume and deciding how much usable storage a household or project needs. A water tank calculator can solve the first part from dimensions. It cannot decide structural adequacy, water quality, pressure, fire-storage rules, or the correct reserve for a particular property.', [
      { title: 'Rectangular tank capacity formula', content: 'For a rectangular tank:\n\nVolume = internal length × internal width × internal liquid height\n\nIf all measurements are in metres, the result is cubic metres. Multiply cubic metres by 1,000 for litres. Example: an internal tank measuring 2.0 m × 1.5 m × 1.2 m has a theoretical volume of 3.6 m³, or 3,600 L. Measure internal dimensions: using external dimensions overstates capacity by the volume of walls, insulation, and fittings.' },
      { title: 'Cylindrical tank capacity formula', content: 'For a vertical cylinder:\n\nVolume = π × radius² × liquid height\n\nRadius is half the internal diameter. A cylindrical tank with 1.2 m internal diameter and 1.5 m liquid height has radius 0.6 m, so volume is π × 0.6² × 1.5 ≈ 1.696 m³, or about 1,696 L. For a horizontal cylinder that is partly full, the simple formula is not enough; segment geometry is required.' },
      { title: 'Litres, gallons, and cubic units', content: 'Useful conversions are 1 m³ = 1,000 L and 1 ft³ = 7.48052 US gal. A US gallon and an imperial gallon are different: 1 US gal is about 3.785 L, while 1 imperial gal is about 4.546 L. Label the gallon system. Convert dimensions to one consistent unit before multiplying; mixing metres, centimetres, feet, and inches is a frequent source of errors.' },
      { title: 'Theoretical volume versus usable capacity', content: 'Theoretical capacity assumes the stated geometry fills completely. Real usable capacity can be lower because of freeboard, overflow level, outlet position, unusable bottom volume, internal components, sediment allowance, and operating controls. Manufacturer-rated nominal capacity can also use its own convention. For an existing tank, use the actual operating liquid height rather than overall shell height. Do not infer a safe fill level from geometry alone.' },
      { title: 'From water demand to tank sizing', content: 'A planning approach is:\n\nRequired usable storage = expected daily demand × desired reserve days + separately required storage\n\nDemand depends on occupancy, fixtures, irrigation, supply reliability, season, conservation, and local rules. Fire reserves or process storage should be determined under applicable requirements, not guessed. After choosing usable storage, select a nominal tank whose usable volume meets it under the manufacturer’s operating levels.' },
      { title: 'How to use the Water Tank Calculator', content: 'Choose the shape and unit system, then enter verified internal dimensions. For a cylinder, distinguish diameter from radius. Review cubic metres, litres, and US gallons and note that the result is theoretical geometric capacity. The tool can also calculate a sphere, but actual manufactured tanks may not be perfect geometric shapes. Ask the supplier for a certified capacity chart where precision matters.' },
      { title: 'Measurement and safety mistakes to avoid', content: 'Do not use outside dimensions, confuse diameter with radius, mix unit systems, ignore sloped or rounded bottoms, or treat total height as fill height. Large tanks impose substantial loads: one litre of water has roughly one kilogram of mass under ordinary conditions. Tank support, foundations, anchorage, access, overflow, backflow protection, and water hygiene require appropriate design and local guidance.' },
    ], [
      { question: 'How do I calculate cistern capacity?', answer: 'Use the formula for its internal shape and operating liquid height. Irregular cisterns may need drawings, a capacity table, or subdivision into simpler volumes.' },
      { question: 'Is tank volume the same as usable water capacity?', answer: 'Not always. Freeboard, outlets, controls, sediment space, and internal fittings can reduce usable volume.' },
      { question: 'Which gallon does the calculator show?', answer: 'The Navorika tool reports US gallons. Convert separately when imperial gallons are required.' },
      { question: 'Can this calculator determine the structurally safe tank size?', answer: 'No. It calculates geometry only; support and tank design require manufacturer and qualified professional guidance.' },
    ], 'Calculate capacity from consistent internal dimensions, then distinguish theoretical volume from usable storage and verify structural and operational requirements separately.'),

  'how-to-calculate-roof-area': article('new-roof', 'How to Calculate Roof Area', 'Calculate simple pitched roof area from footprint and pitch.',
    'Roof footprint is the horizontal plan projection; roof surface area follows the slope and is larger when the roof is pitched. For a simple roof with uniform pitch, a pitch multiplier converts horizontal area to sloped area. Complex intersections, curves, unequal slopes, and dormers need a measured roof plan or professional takeoff.', [
      { title: 'Measure the horizontal roof footprint', content: 'Measure building length and width at the roof plan, including the horizontal projection of eave and gable overhangs where relevant. For a simple rectangle, footprint area = plan length × plan width. Do not measure a sloping rafter as the plan width. Divide L-shaped plans into non-overlapping rectangles, calculate each footprint, and add them.' },
      { title: 'Convert rise and run to a pitch multiplier', content: 'For rise and horizontal run in the same units:\n\nPitch multiplier = √(1 + (rise ÷ run)²)\nRoof surface area = horizontal footprint area × pitch multiplier\n\nFor a 6:12 pitch, multiplier = √(1 + 0.5²) ≈ 1.118. The Roof Pitch Calculator converts rise/run to angle, percent slope, and multiplier; it does not size rafters.' },
      { title: 'Worked gable-roof example', content: 'A simple rectangular roof plan including overhangs measures 42 ft × 30 ft. Horizontal footprint is 1,260 ft². At 6:12 pitch, sloped area is 1,260 × 1.118 ≈ 1,409 ft². If an illustrative 10% purchasing allowance is appropriate for the chosen product and layout, order-area planning becomes about 1,550 ft². Waste is not part of geometric roof area, so show it separately.' },
      { title: 'Gable and simple hip roofs', content: 'For a symmetrical gable roof with one pitch, multiplying the complete horizontal footprint works because both roof planes are represented in the projection. The same principle can work for a simple hip roof when all planes share one pitch and fully cover the footprint. Hip cuts, ridge caps, starter courses, valleys, flashing, and product packaging still affect material quantities. Mixed pitches or additions should be calculated plane by plane.' },
      { title: 'Waste and material planning', content: 'Waste depends on roof shape, valleys, hips, penetrations, product dimensions, fastening pattern, bundle coverage, and installer method. A simple rectangle may need less cutting than a complex roof with the same area. Confirm whether manufacturer coverage is net installed coverage and whether ridge, hip, underlayment, flashing, and fasteners are measured separately.' },
      { title: 'How to use the Roof Area Calculator', content: 'Enter plan length and width, uniform rise per 12 units of run, horizontal overhang, and a custom waste percentage. Keep all length inputs in the tool’s stated units. Review base footprint, pitch multiplier, roof surface, and waste-adjusted planning area separately. The calculator is intended for a simple uniformly pitched roof, not every geometry.' },
    ], [
      { question: 'Is roof area the same as house floor area?', answer: 'No. Roof overhangs and pitch usually make roof surface area larger than the building floor footprint.' },
      { question: 'Does pitch multiplier include waste?', answer: 'No. It converts horizontal projection to sloped geometric area. Waste is a separate purchasing allowance.' },
      { question: 'Can I use this for a roof with multiple pitches?', answer: 'Calculate each plane or pitch zone separately. A single multiplier would be misleading.' },
      { question: 'Does roof area determine structural capacity?', answer: 'No. Loads, framing, connections, drainage, and code compliance require separate design.' },
    ], 'Measure the horizontal projection, apply the correct multiplier to each uniform pitch, and keep geometric area separate from product-specific waste.'),

  'flooring-calculation-guide': article('new-floor', 'How to Calculate Flooring', 'Plan flooring area, packs, cuts, and waste.',
    'A useful flooring estimate separates net floor area from order quantity. Room geometry provides the net area; pack coverage, pattern, cuts, defects, matching, and future repairs determine how much material to purchase.', [
      { title: 'Calculate one room or several rooms', content: 'For a rectangle, area = length × width. Split L-shaped or irregular rooms into non-overlapping rectangles, calculate each, and add them. For multiple rooms, keep a small schedule of room name, dimensions, net area, and unit. Subtract permanent exclusions only when the installation truly will not cover them; many small deductions add measurement risk without saving a pack.' },
      { title: 'Square feet and square metres', content: 'Use consistent units before multiplying. One square metre is about 10.7639 square feet; one square foot is about 0.092903 square metres. Do not convert a length with an area factor. Either convert both length dimensions first, or calculate area and then use the square-unit conversion.' },
      { title: 'Waste, layout, and cutting', content: 'Straight layouts in regular rooms often create fewer offcuts than diagonal, herringbone, bordered, or heavily staggered layouts. Alcoves, columns, doorways, damaged pieces, colour or grain matching, and installer experience also matter. Choose a waste allowance for the actual product and plan rather than treating one percentage as universal. Keep waste-adjusted order area visible separately from measured area.' },
      { title: 'Convert area into packs', content: 'Packs needed = ceiling(order area ÷ verified pack coverage). Suppose two rooms total 418 ft² and a chosen 8% allowance produces 451.44 ft². If each pack states 22.5 ft² of installed coverage, 451.44 ÷ 22.5 = 20.064, so round up to 21 packs. Check batch or dye-lot availability and decide whether a spare sealed pack is appropriate for later repair.' },
      { title: 'Planks, tiles, and coverage claims', content: 'Individual plank or tile count can be estimated from piece coverage, but packaged coverage is usually the better purchasing input. Joint width, fixed orientation, pattern repeats, breakage, and edge cuts change piece counts. Use the Tile Calculator when grid count and joint gap are central; use the Flooring Calculator for area, rates, and broad waste-adjusted cost planning.' },
      { title: 'How to use the Flooring Calculator', content: 'Enter room length and width, select or enter the relevant flooring assumptions, then enter your actual material and installation rates and a chosen waste allowance. The tool handles one rectangle at a time, so aggregate carefully for several rooms or run each room separately. Verify pack coverage and current quotations before ordering.' },
    ], [
      { question: 'Should I subtract kitchen cabinets?', answer: 'Only if the flooring will not run beneath them and the installation plan is settled. Confirm with the installer and product requirements.' },
      { question: 'How much flooring waste should I add?', answer: 'There is no universal percentage. Room shape, pattern, product, defects, batch matching, and installer method determine it.' },
      { question: 'Why must packs be rounded up?', answer: 'Suppliers generally sell complete packs, so a fractional result must be rounded to the next whole pack.' },
      { question: 'Can the calculator plan a herringbone layout?', answer: 'It can apply a user-entered area allowance, but it does not model the detailed pattern or every cut.' },
    ], 'Measure each room consistently, total the net area, apply a layout-specific allowance, and round by verified pack coverage.'),

  'asphalt-calculation-guide': article('new-asphalt', 'How to Calculate Asphalt Volume & Tonnage', 'Estimate asphalt quantities without treating density as universal.',
    'Asphalt planning moves through four steps: area, compacted thickness, volume, and mass. The arithmetic is straightforward, but density, compaction, lift design, subgrade, and plant ordering requirements are project-specific.', [
      { title: 'Area and compacted depth', content: 'For a rectangular driveway, area = length × width. Divide irregular paving into measured shapes and avoid overlap. Convert the specified compacted thickness to the same base unit before multiplying. A common error is entering millimetres as metres: 50 mm is 0.05 m, not 50 m.' },
      { title: 'Volume and tonnage formulas', content: 'Volume = area × compacted thickness\nMass = volume × compacted density\nMetric tonnes = kilograms ÷ 1,000\n\nFor imperial measurements, calculate cubic feet, convert as needed, and use a compatible density unit. Density must describe the relevant compacted mix and conditions; aggregate type, binder, temperature, and achieved compaction all affect it.' },
      { title: 'Worked driveway example', content: 'A 20 m × 4 m driveway has 80 m² of area. At 50 mm compacted thickness, volume is 80 × 0.05 = 4.0 m³. Using an illustrative project assumption of 2,350 kg/m³ gives 9,400 kg, or 9.4 metric tonnes before allowance. If a chosen 5% planning allowance is justified, the order estimate is 9.87 tonnes. The density and allowance are examples, not universal values.' },
      { title: 'Waste, compaction, and delivery planning', content: 'Do not casually add a “compaction factor” when the density and depth already refer to compacted material; that can double-count. Allowance may cover small placement losses, geometry, minimum plant quantities, or uncertainty, but should be documented. Contractors may plan several lifts, joints, tack coat, transport, paving sequence, truck payload, and temperature windows separately.' },
      { title: 'How to use the Asphalt Calculator', content: 'Enter length, width, compacted design thickness, a density supplied for the mix, and a chosen waste percentage. Review cubic volume and tonnes. The displayed truck count is only an illustration based on the tool’s stated payload assumption; actual legal payload and supplier dispatch rules vary. Confirm quantities with the asphalt plant and paving contractor.' },
      { title: 'What quantity alone cannot tell you', content: 'A tonnage result does not establish pavement thickness, drainage, subgrade preparation, base course, mix selection, compaction target, or structural suitability. Those decisions depend on traffic, soil, climate, standards, and site conditions.' },
    ], [
      { question: 'What asphalt density should I use?', answer: 'Use a value supplied for the selected mix and relevant compacted condition. No single density is exact for all asphalt.' },
      { question: 'Should thickness be loose or compacted?', answer: 'Use the thickness and density on the same basis. The Navorika tool asks for compacted design thickness and compacted density.' },
      { question: 'Does tonnage include base material?', answer: 'No. Asphalt and aggregate base are separate materials and should be estimated separately.' },
      { question: 'Can this design a driveway pavement?', answer: 'No. It estimates quantity from user inputs; pavement design needs site-specific expertise.' },
    ], 'Use consistent units and a project-specific compacted density, then confirm mix, layers, allowances, and delivery quantities with the supplier and contractor.'),

  'gravel-calculation-guide': article('new-gravel', 'How to Calculate Gravel', 'Estimate gravel volume and weight for driveways and landscaping.',
    'Gravel is bought by volume or weight, so a good estimate calculates both and states the material condition. Particle size, moisture, grading, angularity, and compaction change bulk density and finished depth.', [
      { title: 'Area multiplied by depth', content: 'For a rectangular layer:\n\nVolume = length × width × depth\n\nConvert depth before multiplying. For example, 3 inches is 0.25 ft. A 40 ft × 10 ft driveway at 3 inches has 40 × 10 × 0.25 = 100 ft³ of geometric volume. Divide by 27 to get about 3.70 yd³ before any allowance.' },
      { title: 'Convert volume to tonnes', content: 'Weight = volume × bulk density. Use supplier density for the named gravel in its expected loose or compacted and moisture condition. “Gravel” can mean pea gravel, river rock, crushed stone, or a graded road-base blend, and their bulk densities differ. A calculator preset is a planning assumption, not a material certificate.' },
      { title: 'Loose delivery versus compacted finished layer', content: 'A finished compacted volume may require more loose delivered volume because particles rearrange under compaction. The relationship depends on gradation, moisture, equipment, and target density. Ask the supplier or contractor for a conversion appropriate to the product. Do not automatically apply both a loose-to-compacted factor and a density assumption that already represents the conversion.' },
      { title: 'Allowances and worked planning', content: 'If supplier guidance converts the 3.70 yd³ geometric need to 4.15 yd³ loose delivery and the site plan justifies a further small allowance for uneven grade, document each step rather than hiding both in one percentage. Round according to bag size, bulk increment, or truck policy. Verify access and axle/load limits before arranging a bulk delivery.' },
      { title: 'Driveways and landscaping', content: 'Driveway quantity depends on excavated grade, edge restraint, base and surface layers, drainage, and compaction. Landscaping beds may use decorative gravel at a different depth and often need geotextile or edging decisions. Separate soil excavation from imported gravel. The Sand, Topsoil, Mulch, and Paver calculators support adjacent landscape quantities.' },
      { title: 'How to use the Gravel Calculator', content: 'Enter the measured rectangular dimensions and depth, then select the closest supported gravel type. Review cubic metres, tonnes, and the tool’s indicative load count. Because its density presets and truck capacity are generic, replace them with a supplier quotation when ordering.' },
    ], [
      { question: 'How many cubic feet are in a cubic yard?', answer: 'There are 27 cubic feet in one cubic yard.' },
      { question: 'Why do gravel tonnes vary for the same volume?', answer: 'Material type, grading, voids, moisture, and compaction change bulk density.' },
      { question: 'Should I calculate loose or compacted gravel?', answer: 'Start from required finished geometry, then use product-specific supplier guidance to convert to delivered quantity.' },
      { question: 'Does the calculator include settlement?', answer: 'Its built-in result uses stated geometric and density assumptions; site-specific compaction or settlement must be handled separately.' },
    ], 'Calculate finished volume first, use material-specific density and loose/compacted guidance, and round to the supplier’s actual sales unit.'),

  'electricity-cost-calculation-guide': article('new-electricity', 'How to Calculate Electricity Cost', 'Calculate appliance energy and running cost from watts and kWh.',
    'Electricity cost depends on energy, not power alone. Watts describe the rate at which an appliance uses energy; kilowatt-hours combine that power with operating time. Multiply energy by the tariff that actually applies to estimate usage cost.', [
      { title: 'Watts, kilowatts, and kWh', content: 'Convert watts to kilowatts by dividing by 1,000. Then:\n\nEnergy (kWh) = power (kW) × hours\nCost = energy (kWh) × electricity rate per kWh\n\nA 100 W device running for 5 hours uses 0.1 kW × 5 h = 0.5 kWh. Watt is a power unit; kWh is an energy unit, despite the common phrase “kilowatts per hour.”' },
      { title: 'Daily, monthly, and annual examples', content: 'Suppose a 1,500 W heater runs 2 hours per day. Daily energy is 1.5 × 2 = 3 kWh. At an illustrative user-entered rate of 0.20 currency units per kWh, daily usage cost is 0.60, a 30-day estimate is 18.00, and a 365-day estimate is 219.00. The tariff is only an example; enter the current rate from your bill.' },
      { title: 'Duty cycles and variable power', content: 'Rated watts may be maximum input rather than average use. Refrigerators, air conditioners, pumps, and thermostatically controlled heaters cycle on and off. Computers and variable-speed equipment change load. For better estimates, use a measured average from a suitable energy meter or multiply rated power by a defensible duty-cycle assumption.' },
      { title: 'Standby use and multiple appliances', content: 'A small continuous standby load can accumulate. A 5 W load operating 24 hours uses 0.12 kWh per day. For several appliances, calculate each device using its own watts and runtime, then add kWh and cost. This is clearer than adding wattages when their schedules differ.' },
      { title: 'Tariffs and the full bill', content: 'A simple energy-rate estimate may not match the final bill. Real tariffs can include fixed charges, taxes, slabs or tiers, time-of-use prices, demand charges, fuel adjustments, minimum charges, export credits, or subsidies. Derive an appropriate marginal or average rate from the bill according to the decision being made, and do not hard-code a universal tariff.' },
      { title: 'How to use the Electricity Cost Calculator', content: 'Enter appliance wattage, average hours per day, number of days, and your current rate per kWh. Review energy and daily, 30-day, annual, and selected-period cost. Repeat for each appliance when building a household estimate. The tool estimates usage charges and does not reproduce every utility billing rule.' },
    ], [
      { question: 'How do I convert watts to kWh?', answer: 'Divide watts by 1,000, then multiply by hours of operation.' },
      { question: 'Can I use the wattage on the label?', answer: 'Yes for a rough upper-bound or steady-load estimate, but cycling and variable-power devices may use less on average.' },
      { question: 'Why does the result differ from my bill?', answer: 'Bills may include other loads, fixed fees, taxes, tiered prices, demand charges, and changing usage.' },
      { question: 'How do I include standby power?', answer: 'Calculate the standby wattage over its actual hours—often close to 24 per day—and add that energy separately.' },
    ], 'Convert power to kW, multiply by realistic runtime, and apply the current relevant tariff while keeping broader bill charges separate.'),

  'brick-calculation-guide': article('new-brick', 'How to Calculate Bricks for a Wall', 'Estimate brick count with openings, mortar joints, and waste.',
    'Brick quantities depend on wall geometry and the actual masonry unit, joint, bond, and wall thickness. Brick sizes vary by country, standard, manufacturer, and product, so measure or verify the specified unit rather than relying on a universal bricks-per-area rule.', [
      { title: 'Measure net wall area', content: 'Gross wall area = wall length × wall height. Subtract measured doors, windows, and other openings to obtain net face area when using an area method. Keep units consistent. For several walls, calculate each separately so thickness and opening assumptions remain traceable.' },
      { title: 'Brick size plus mortar joint', content: 'A nominal module combines the actual brick face dimensions with the specified mortar joint. For a simple face-area estimate:\n\nBricks per area ≈ 1 ÷ ((brick length + joint) × (brick height + joint))\n\nThis assumes the stated orientation and regular joints. Bond pattern, closures, piers, returns, and wall ends affect the count.' },
      { title: 'Wall-volume method and thickness', content: 'The Navorika calculator uses wall volume divided by a nominal brick-and-joint module, so wall thickness is explicit. This is useful for comparing thicker masonry, but real bond geometry and mortar distribution are more complicated than a repeating box. Confirm whether dimensions are actual or nominal and whether the tool’s orientation matches the work.' },
      { title: 'Worked metric example', content: 'A 6 m × 2.7 m wall has 16.2 m² gross area. A 1.2 m × 1.5 m opening removes 1.8 m², leaving 14.4 m². If the specified brick-and-joint face module were illustratively 0.21 m × 0.075 m, one-layer face count is 14.4 ÷ 0.01575 ≈ 915 bricks before bond details and allowance. Do not reuse this module for a different brick or joint.' },
      { title: 'Waste, breakage, and ordering', content: 'Cuts, breakage, colour blending, complex bonds, site handling, and supplier pack quantities influence the purchasing allowance. Salvage and return policies also matter. Keep base geometric count and allowance visible separately, round up to complete packs or pallets, and confirm matching batches for exposed work.' },
      { title: 'How to use the Brick Calculator', content: 'Enter wall length, height, and thickness; actual brick dimensions; mortar-joint thickness; and a project-specific waste percentage. Adjust for openings before entry if the current interface does not provide separate opening fields. Review brick count and mortar-related outputs as planning estimates, then check drawings, bond, specification, and supplier units.' },
    ], [
      { question: 'How many bricks are in a square metre?', answer: 'There is no universal number. It depends on brick face size, orientation, mortar joint, and bond.' },
      { question: 'Should openings be subtracted?', answer: 'Usually yes when they are large and confirmed, while small openings and detailing may be handled according to the estimator’s measurement rules.' },
      { question: 'Are nominal and actual brick sizes the same?', answer: 'Not necessarily. Nominal dimensions may include the intended mortar module; verify the manufacturer specification.' },
      { question: 'Does the calculator design the wall?', answer: 'No. Structural, fire, moisture, movement-joint, and code requirements need appropriate design.' },
    ], 'Use verified brick and joint dimensions, calculate net wall geometry, and adjust for the actual bond, thickness, cuts, and supplier packaging.'),

  'dimensional-weight-guide': article('new-dim', 'Dimensional Weight Guide', 'Understand dimensional, actual, and billable shipping weight.',
    'Dimensional weight—also called volumetric weight—converts the space a package occupies into a comparison weight. Carriers use it because a large light carton can consume vehicle or aircraft capacity long before the payload limit is reached.', [
      { title: 'Actual, dimensional, and billable weight', content: 'Actual weight is measured on a scale. Dimensional weight is calculated from package volume and a divisor. Billable weight is commonly based on the greater of actual and dimensional weight, after the carrier applies its own measurement, rounding, minimum, oversize, service, and packaging rules.' },
      { title: 'Metric and imperial formulas', content: 'A general formula is:\n\nDimensional weight = length × width × height ÷ divisor\n\nUse dimensions and a divisor designed for the same unit system. A divisor expressed for centimetres and kilograms cannot be used unchanged with inches and pounds. Measure the package’s outermost dimensions, including bulges or projections, as the carrier instructs.' },
      { title: 'Worked example with an illustrative divisor', content: 'Consider a 50 cm × 40 cm × 30 cm carton. Volume is 60,000 cm³. Using an illustrative divisor of 5,000 cm³/kg gives dimensional weight of 12 kg. If scale weight is 7 kg, the comparison points to 12 kg before carrier rounding. The divisor is an example only; obtain the current divisor for the carrier, service, route, and account.' },
      { title: 'Why divisors differ', content: 'A smaller divisor produces a larger dimensional weight. Carriers can publish different divisors for domestic and international services, air and ground products, retail and contracted accounts, or particular packaging. Rules can change. Some carriers round each dimension before calculation and then round weight upward, which can make a quote differ from unrounded arithmetic.' },
      { title: 'Reduce avoidable package volume', content: 'Choose a carton close to the protected item size, remove unnecessary void, and use packaging that still meets damage-prevention requirements. Reducing volume is not worthwhile if it increases breakage, violates dangerous-goods rules, or loses required cushioning. Compare packaging and shipping cost together.' },
      { title: 'How to use the Dimensional Weight Calculator', content: 'Choose metric or imperial, enter external length, width, height, actual weight, and the divisor published for the shipment. Compare actual, dimensional, and estimated billable weight. Treat the result as a pre-shipment estimate and verify the carrier’s current rounding, oversize, and rate rules.' },
    ], [
      { question: 'Is volumetric weight the same as dimensional weight?', answer: 'They are commonly used for the same space-based shipping concept.' },
      { question: 'Which divisor should I use?', answer: 'Use the current divisor published or contracted for the exact carrier, service, route, unit system, and account.' },
      { question: 'Why did the carrier measure a higher weight?', answer: 'Its measured dimensions, dimension rounding, weight rounding, oversize rules, or divisor may differ from your assumptions.' },
      { question: 'Is dimensional weight a shipping price?', answer: 'No. It is a billing-weight input; zones, services, surcharges, and account rates still determine price.' },
    ], 'Measure the packed outer carton, use the exact service-specific divisor, and compare dimensional with scale weight under the carrier’s current rounding rules.'),

  'construction-estimate-quote-guide': article('new-estimate', 'Construction Estimate & Quote Guide', 'Build clear, traceable construction estimates and quotes.',
    'A client-ready construction estimate should make scope, quantities, rates, assumptions, and commercial adjustments understandable. A polished total without a defined scope is not a reliable estimate. Terminology also varies: “estimate,” “quote,” “proposal,” and “bid” can carry different meanings by jurisdiction and business practice.', [
      { title: 'Estimate versus quote', content: 'An estimate generally communicates an anticipated cost based on stated information and uncertainty. A quote may communicate a firmer offered price for a defined scope and validity period, but the legal effect depends on wording, local law, acceptance, and the surrounding contract process. Label documents consistently with professional and legal advice; a generator cannot determine whether a document is contractually binding.' },
      { title: 'Define project scope before pricing', content: 'Record client and site, drawing and revision references, inclusions, exclusions, allowances, schedule assumptions, measurement basis, procurement method, and who supplies permits or utilities. Break the scope into work packages or a work breakdown structure. Scope gaps create more risk than a perfectly calculated markup can fix.' },
      { title: 'Build quantities and direct costs', content: 'For each line item, record description, quantity, unit, and unit rate. Line cost = quantity × rate. Separate materials, labour, equipment, subcontractors, and other direct costs when useful. Rates should come from current supplier quotations, wage and productivity assumptions, subcontractor proposals, and project conditions—not unsupported generic prices.' },
      { title: 'Overhead, markup, contingency, and tax', content: 'Overhead covers business or project costs not assigned directly to one item. Markup is an addition used to reach the selling price; margin is profit divided by selling price, so markup percentage and margin percentage are not interchangeable. Contingency should correspond to identified uncertainty and must not hide omitted scope. Tax treatment depends on jurisdiction and transaction facts. State each calculation base to prevent double-counting.' },
      { title: 'A practical example structure', content: 'A concise document can include: header and estimate number; client/project details; scope summary; itemized quantities and rates; direct-cost subtotal; overhead; contingency or allowances; markup; discount if any; tax if applicable; total; assumptions and exclusions; schedule or payment notes; quote validity; and acceptance or next-step instructions. Version and date the document so changes are traceable.' },
      { title: 'Client-ready workflow with Navorika tools', content: 'Use trade calculators such as Brick, Flooring, Roof Area, Gravel, or House Construction Cost to develop planning quantities, then transfer verified quantities and current rates into the Construction Estimate Builder. The Contractor Estimate Generator supports contractor-branded commercial presentation. The Construction Cost Calculator provides a broader early cost split. Review every exported line, tax entry, assumption, and exclusion before sharing.' },
      { title: 'Quality-control checklist', content: 'Check arithmetic, units, scope coverage, duplicate items, drawing revisions, supplier quotation dates, labour productivity, equipment duration, subcontractor exclusions, escalation, contingency basis, overhead and markup bases, tax, rounding, quote validity, and document version. Have the responsible estimator review the output; software formatting does not validate the underlying scope.' },
    ], [
      { question: 'Is an estimate the same as a quote?', answer: 'Not necessarily. Usage and legal effect vary by business practice, wording, jurisdiction, and contract process.' },
      { question: 'Should markup be added to labour and material?', answer: 'That depends on the company’s pricing method. State the calculation base and avoid counting overhead or profit twice.' },
      { question: 'What should exclusions contain?', answer: 'Clearly list work, fees, conditions, or risks not included so the client can compare offers and request clarifications.' },
      { question: 'Does the estimate builder supply market rates?', answer: 'No. Users must enter current project-specific quantities, rates, tax assumptions, and commercial terms.' },
    ], 'A strong estimate is traceable from scope to quantities to rates, with commercial additions and exclusions stated clearly and reviewed by the responsible professional.'),

  'base64-encoding-guide': article('base64', 'Base64 Encoding Guide', 'Understand Base64, Base64url, padding, Unicode, and security.',
    'Base64 represents bytes using printable ASCII characters. It helps binary data travel through text-oriented systems, but it does not encrypt, authenticate, compress, or protect that data. Anyone who has the encoded value can usually decode it.', [
      { title: 'How Base64 encoding works', content: 'Base64 reads input bytes in groups of three: 24 bits. It divides those bits into four 6-bit values and maps each value to one of 64 alphabet characters. The standard alphabet uses A–Z, a–z, 0–9, plus, and slash. Because four text characters represent three source bytes, Base64 typically adds about 33% size overhead before line breaks, data-URL prefixes, or other wrapping.' },
      { title: 'Padding and the equals sign', content: 'When the byte count is not divisible by three, the final group is incomplete. Standard Base64 commonly uses one or two equals signs as padding so the encoded length aligns to a four-character group. Padding is metadata about the final group, not encrypted content. Some specifications permit or require omitted padding, so decoding should follow the relevant protocol.' },
      { title: 'Base64url and JWT segments', content: 'Base64url replaces plus with hyphen and slash with underscore, making the alphabet safer in URLs and filenames; padding is often omitted. It is a related encoding, not simply arbitrary standard Base64 text. JWT header and payload segments use Base64url, while their decoded bytes normally contain JSON.' },
      { title: 'Text, Unicode, and decoding', content: 'Base64 operates on bytes, not abstract characters. Text must first be encoded as bytes—usually UTF-8—and decoded bytes must be interpreted with the same character encoding. Applying browser btoa directly to arbitrary Unicode text can fail or corrupt characters unless UTF-8 conversion is handled. A successful Base64 decode can also produce bytes that are not valid text.' },
      { title: 'Common uses', content: 'Base64 appears in MIME email transfer, data URLs, small embedded images, API payloads, certificates, and tokens. It can simplify transport through text-only channels but increases size and may reduce cacheability or readability. For large binary files, a normal binary upload or file URL is often more efficient.' },
      { title: 'Common errors and security misconceptions', content: 'Errors include confusing Base64 with Base64url, missing or invalid padding, whitespace inserted by transport, invalid alphabet characters, decoding bytes with the wrong character set, or assuming every decoded result is readable text. Encoding secrets does not secure them. Sensitive values still require appropriate access control and encryption; decoded JWT claims remain untrusted until signature and claim validation succeeds.' },
      { title: 'Using the Base64 Encoder', content: 'Enter text to encode it as UTF-8 Base64, or paste Base64 to decode bytes as strict UTF-8. Work locally when values are sensitive and inspect errors instead of silently accepting replacement characters. Use the JWT Decoder for token segments and JSON Formatter for decoded structured data.' },
    ], [
      { question: 'Is Base64 encryption?', answer: 'No. It is reversible encoding and provides no confidentiality.' },
      { question: 'Why is Base64 larger than the original?', answer: 'Four Base64 symbols represent each three-byte group, creating roughly one-third overhead before wrappers.' },
      { question: 'What does equals padding mean?', answer: 'It marks an incomplete final three-byte group so standard output aligns to four characters.' },
      { question: 'Can Base64 encode images?', answer: 'Yes, it can represent image bytes, often in a data URL, but size and caching tradeoffs should be considered.' },
      { question: 'Are Base64 and Base64url interchangeable?', answer: 'Not always. Their alphabets and padding conventions differ, so use the variant required by the protocol.' },
    ], 'Base64 is a byte-to-text transport encoding: choose the correct variant and character encoding, expect size overhead, and never treat it as security.'),

  'jwt-decoding-guide': article('jwt', 'JWT Decoding Guide', 'Decode JWT structure without confusing inspection with verification.',
    'A compact JSON Web Token commonly has three period-separated segments: header.payload.signature. Decoding the first two segments makes their JSON readable. It does not prove who created the token, whether it was altered, whether its claims apply to your application, or whether it is currently acceptable.', [
      { title: 'Header, payload, and signature', content: 'The header describes token-processing information such as alg and often typ. The payload contains claims. The signature is computed from protected input using the declared and permitted algorithm plus a key. Each compact segment uses Base64url. A malformed token may have the wrong segment count, invalid Base64url, non-UTF-8 bytes, or invalid JSON.' },
      { title: 'Registered claims to recognize', content: 'Common names include iss (issuer), sub (subject), aud (audience), exp (expiration time), nbf (not before), and iat (issued at). In the header, alg identifies an algorithm and typ can identify the token type. A decoder should display these values as untrusted data. Applications must define expected issuer, audience, algorithms, keys, time tolerance, and required claims.' },
      { title: 'Decoding is not signature verification', content: 'Anyone can create three Base64url segments or change a payload. Verification cryptographically checks the signature with a trusted key and an explicitly allowed algorithm. Secure validation also checks claims and application context. Never accept an algorithm merely because the untrusted header requests it, and never describe a token as valid because it decodes cleanly.' },
      { title: 'Expiration and time claims', content: 'exp is generally a NumericDate after which the token must not be accepted; nbf indicates a time before which it must not be accepted; iat records issuance time. Displaying a human-readable timestamp is convenient, but acceptance requires correct clock handling, reasonable skew policy, and other validation. An unexpired token can still have an invalid signature or wrong audience.' },
      { title: 'Privacy and safe debugging', content: 'JWT payloads are encoded, not encrypted, unless a separate encrypted token format is used. They can expose names, identifiers, scopes, or internal metadata to anyone holding the token. Do not paste production access or refresh tokens into unknown sites, tickets, chat, logs, or screenshots. Redact tokens and prefer local inspection.' },
      { title: 'Using the JWT Decoder', content: 'Paste a compact token to inspect locally decoded UTF-8 JSON from its header and payload. Use the JSON Formatter for nested claims and the Base64 guide to understand Base64url. The tool intentionally does not verify the signature or trust claims, so use your application’s maintained JWT library and trusted configuration for verification.' },
    ], [
      { question: 'Does decoding a JWT validate it?', answer: 'No. Validation requires signature verification and application-specific claim checks.' },
      { question: 'Can I edit a decoded JWT?', answer: 'You can change text, but that invalidates the original signature. A verifier should reject the altered token.' },
      { question: 'Does exp prove a token is safe to accept?', answer: 'No. It is only one untrusted claim until the signature, issuer, audience, algorithm, time, and other requirements are validated.' },
      { question: 'Why will a JWT not decode?', answer: 'It may have the wrong number of segments, invalid Base64url, invalid UTF-8 or JSON, or it may not be a compact JWT.' },
      { question: 'Are JWT payloads private?', answer: 'Normally no. Signed JWT payloads are readable; avoid putting unnecessary secrets or sensitive personal data in them.' },
    ], 'Use decoding for inspection only. Trust a JWT only after cryptographic verification and complete application-specific claim validation.'),

  'json-formatting-guide': article('json', 'JSON Formatting Guide', 'Work safely with JSON formatting, validation, conversion, and comparison.',
    'JSON is a strict text format for exchanging structured data. Pretty printing changes whitespace for readability; minification removes unnecessary whitespace. Both operations depend on parsing, while schema validation, flattening, conversion, and comparison answer different questions.', [
      { title: 'Valid JSON values and structure', content: 'JSON values can be objects, arrays, strings, numbers, booleans, or null. Objects contain comma-separated name/value members inside braces; arrays contain comma-separated values inside brackets. Property names and strings require double quotes. Standard JSON has no comments, trailing commas, undefined, functions, NaN, or Infinity.' },
      { title: 'Quoting, commas, numbers, and escaping', content: 'Use a colon between an object key and value and commas only between members or elements. Escape a quote inside a string as \\" and a backslash as \\\\. Control characters require valid escapes. JSON number grammar rejects leading plus signs, hexadecimal notation, and some language-specific numeric forms. Parser errors often point just after the real mistake, so inspect the preceding quote, comma, or bracket.' },
      { title: 'Pretty printing, minification, and validation', content: 'A formatter parses and serializes with indentation; a minifier serializes without presentation whitespace. Syntax validation asks whether the text follows JSON grammar. Schema validation asks whether valid JSON has required properties, types, formats, and constraints. Formatting cannot repair ambiguous invalid input safely, and valid syntax does not guarantee the data is correct for an API.' },
      { title: 'JSON versus JavaScript object literals', content: 'JavaScript object literals can allow unquoted identifier keys, single-quoted strings, comments, trailing commas, methods, undefined, and computed values. Those features do not make valid JSON. JSON.parse accepts JSON text; evaluating unknown text as JavaScript is unsafe and unnecessary.' },
      { title: 'Flattening and JSON/CSV conversion', content: 'Flattening turns nested paths into columns or key paths, but arrays, repeated records, missing values, and nested objects require explicit conventions. JSON to CSV works best with a consistent array of records; CSV to JSON requires choices about headers, empty cells, delimiters, and type inference. Preserve an original source and review round trips because CSV cannot represent every JSON structure without loss or conventions.' },
      { title: 'Schema validation and diff/compare', content: 'Use JSON Schema Validator when a payload must meet a contract, and JSON Diff & Compare to find structural or value changes between two documents. A textual diff can be noisy when only formatting or key order changes; a parsed structural comparison is often more useful. JWT payloads can be formatted as JSON after decoding but remain untrusted until token verification.' },
      { title: 'Privacy and practical tool workflow', content: 'Production payloads may contain credentials, tokens, personal data, or confidential configuration. Redact them and prefer local tools. Start with JSON Formatter for syntax, then use schema validation, diff, JSON to CSV Flattener, or CSV to JSON Converter according to the task. Large documents can exceed browser memory because both source text and parsed objects may be retained.' },
    ], [
      { question: 'Does JSON allow single quotes?', answer: 'No. JSON strings and object property names use double quotes.' },
      { question: 'Is pretty JSON more valid than minified JSON?', answer: 'No. Whitespace outside strings does not determine validity.' },
      { question: 'Can a formatter fix invalid JSON?', answer: 'It can report a parse error, but automatic repair may guess incorrectly. Correct the source based on intended data.' },
      { question: 'What is the difference between JSON validation and schema validation?', answer: 'Syntax validation checks JSON grammar; schema validation checks the permitted structure and values of already valid JSON.' },
      { question: 'Is JSON to CSV always reversible?', answer: 'No. Nested structures, arrays, types, and missing values may be flattened or represented with conventions that lose information.' },
    ], 'Treat formatting, syntax validation, schema checking, conversion, and comparison as distinct steps, and keep sensitive data in a trusted local workflow.'),

  'heart-rate-zones-guide': article('heart', 'Heart Rate Zones Guide', 'Understand target zones and their limitations.',
    'Heart-rate zones divide exercise intensity into ranges, usually from an estimated maximum heart rate or heart-rate reserve. They can support training conversations, but an age formula is a population estimate—not a diagnosis, medical clearance, or personalized ceiling.', [
      { title: 'Resting, maximum, and target heart rate', content: 'Resting heart rate is commonly measured when awake, calm, and seated or lying down. Maximum heart rate is the highest rate reached during maximal effort; age equations only estimate it. A target zone is a chosen percentage range used as an intensity guide. Heart rate responds to fitness, heat, hydration, stress, illness, altitude, caffeine, medication, and many other factors.' },
      { title: 'Percentage of estimated maximum', content: 'The Navorika tool uses the simple estimate 220 − age. A target is then estimated maximum × chosen percentage. The American Heart Association describes broad guides of about 50–70% of maximum for moderate activity and 70–85% for vigorous activity. Beginners may aim toward the lower part and progress gradually, subject to health guidance.' },
      { title: 'Heart-rate reserve method', content: 'Heart-rate reserve (HRR) = estimated maximum − resting heart rate. A reserve-based target is resting rate + intensity percentage × HRR. This incorporates the entered resting value, but it still inherits error from the maximum estimate and is not automatically individualized medical advice. Measure resting pulse consistently over several calm mornings when using it for training context.' },
      { title: 'Worked educational example', content: 'For age 40, 220 − age estimates 180 BPM. A 50–70% range is 90–126 BPM. If resting rate is 60 BPM, HRR is 120; an illustrative 60% HRR target is 60 + 0.60 × 120 = 132 BPM. These two methods answer slightly different questions and should not be presented as precise personal limits.' },
      { title: 'Wearables and perceived effort', content: 'Optical wrist sensors can vary with fit, motion, temperature, skin contact, tattoos, and rapid intensity changes. A chest strap may respond more reliably for some interval work but is still a measurement device, not medical interpretation. Cross-check with breathing, talk test, perceived exertion, pace, power, and how you feel.' },
      { title: 'How to use the Heart Rate Calculator safely', content: 'Enter a manual pulse count to convert it to BPM. Optionally enter adult age and resting heart rate to view broad maximum, percentage, and reserve-based estimates supported by the tool. Stop exercise and seek urgent medical help for chest pain, fainting, severe or unusual breathlessness, or other concerning symptoms. People with heart conditions or medicines that affect pulse should request individualized exercise guidance.' },
    ], [
      { question: 'Is 220 minus age accurate?', answer: 'It is a rough population estimate with substantial individual variation.' },
      { question: 'Which heart-rate zone method is best?', answer: 'No formula is best for everyone. HRR adds resting rate context, while supervised testing and professional guidance can provide stronger individual information.' },
      { question: 'Why does my wearable jump or lag?', answer: 'Motion, fit, cold, poor contact, and fast intensity changes can affect optical readings.' },
      { question: 'Do medicines change heart-rate zones?', answer: 'Some medicines can alter resting rate and exercise response. Ask a clinician for an appropriate intensity method.' },
      { question: 'Are target zones medical advice?', answer: 'No. They are educational training estimates and do not diagnose or clear someone for exercise.' },
    ], 'Use calculated zones as broad ranges, compare them with perceived effort, and obtain individualized guidance when symptoms, conditions, or medications are relevant.'),

  'how-to-calculate-emi': article('emi', 'EMI Calculation Guide', 'Calculate EMI for home, car, and personal loans.',
    'An equated monthly instalment (EMI) is the scheduled level payment for an amortizing loan. EMI arithmetic helps compare home, car, and personal loan scenarios, but affordability also depends on fees, insurance, changing rates, income stability, other debts, and loan terms.', [
      { title: 'Principal, rate, tenure, and the EMI formula', content: 'For a reducing-balance loan:\n\nEMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)\n\nP is principal, r is the monthly periodic interest rate, and n is the number of monthly instalments. Convert a nominal annual percentage rate to monthly form as stated by the loan terms; a simple calculator commonly uses annual rate ÷ 12 ÷ 100. Tenure in years must be multiplied by 12.' },
      { title: 'Worked example', content: 'For an illustrative principal of 500,000 currency units, 10% annual reducing-balance rate, and 5-year tenure, r = 0.10 ÷ 12 and n = 60. The formula gives an EMI of about 10,624. Total scheduled payments are about 637,411 and total interest about 137,411, subject to rounding and payment timing. This is an arithmetic example, not a loan offer.' },
      { title: 'Reducing balance and amortization', content: 'Interest for each period is calculated on the outstanding balance. Early payments usually contain more interest because principal is highest; later payments contain more principal. An amortization schedule shows opening balance, interest, principal repaid, and closing balance. Multiplying the first month’s interest by the whole tenure is incorrect.' },
      { title: 'Personal, car, and home loan context', content: 'The same core formula can model many fixed-rate amortizing loans. Personal loans may have different fees and pricing from secured loans. Car loans may include deposits, trade-ins, balloon payments, insurance, or add-ons. Home loans may have long tenures, floating rates, staged disbursements, and significant fees. Model the amount actually financed and verify whether the product follows the assumed reducing-balance structure.' },
      { title: 'How rate and tenure change cost', content: 'A higher rate raises EMI and total interest. A longer tenure generally lowers EMI but increases total interest because the balance remains outstanding longer. Compare several terms using monthly payment, total repayment, total interest, effective cost, fees, and flexibility—not EMI alone. A low EMI can simply be a more expensive long loan.' },
      { title: 'Prepayment and rate changes', content: 'A principal prepayment can reduce future interest, but the lender may reduce EMI, shorten tenure, charge a fee, or apply product-specific rules. Floating-rate changes can alter payment or tenure. Request a revised amortization schedule and confirm how payments are allocated before relying on a projected saving.' },
      { title: 'How to use the Loan EMI Calculator', content: 'Enter principal, annual interest rate, and tenure. Review EMI, total interest, and total repayment, then test shorter tenure, higher-rate stress, and smaller principal scenarios. Use the Loan Amortization Suite for payment-by-payment detail. Add processing fees, insurance, taxes, and other costs separately if the tool does not include them.' },
    ], [
      { question: 'Is personal loan EMI calculated differently?', answer: 'The same formula often applies to fixed-rate reducing-balance loans, but fees, rate conventions, and product terms can differ.' },
      { question: 'Does a lower EMI mean a cheaper loan?', answer: 'No. Extending tenure can lower EMI while raising total interest.' },
      { question: 'What is reducing-balance interest?', answer: 'Interest is calculated on the outstanding principal, which generally declines as payments are made.' },
      { question: 'Does the calculator include processing fees?', answer: 'No unless explicitly shown. Compare fees, insurance, taxes, penalties, and effective annual cost separately.' },
      { question: 'Will prepayment always reduce EMI?', answer: 'Not necessarily. A lender may shorten tenure instead, and charges or conditions can apply.' },
    ], 'Use the existing EMI guide as the primary informational page for personal, car, and home loan intent; compare total borrowing cost and terms, not monthly payment alone.'),

  'step-to-3d-pdf-conversion-guide': article(
    'batch-2026-09-step',
    'STEP to 3D PDF Conversion Guide: CAD Sharing, PRC Geometry & Viewer Setup',
    'Learn how to convert STEP/STP CAD models into interactive 3D PDFs. Understand ISO 10303, PRC geometry, what survives conversion, and Acrobat viewer settings.',
    'Sharing three-dimensional CAD models across distributed engineering teams, suppliers, and clients often stalls when recipients lack expensive, seat-licensed CAD workstations. Converting STEP (STP) files into interactive 3D PDFs bridges this gap, allowing anyone with a free desktop PDF viewer to orbit, pan, zoom, and inspect assemblies in full 3D without exposing sensitive parametric design trees.',
    [
      {
        title: 'What STEP and STP CAD files are (ISO 10303)',
        content: `STEP stands for the Standard for the Exchange of Product model data, governed by the international standard ISO 10303. It uses a clear-text ASCII exchange structure defined under ISO 10303-21 (commonly referred to as "Part 21"):

STEP vs STP:
The file extensions .step and .stp represent identical data structures. The 3-character .stp extension was popularized by legacy MS-DOS and Windows file systems constrained by 8.3 filename conventions, whereas .step is the formal four-character standard extension. Both conform to the same ISO 10303-21 text specification and can be processed identically.

Application Protocols (AP):
STEP models are structured under standardized Application Protocols tailored to industrial disciplines:
• AP203: Configuration controlled 3D designs of mechanical parts and assemblies. Widely used in general mechanical engineering and aerospace for solid geometry exchange.
• AP214: Core data for automotive mechanical design processes. Extends AP203 by supporting surface colors, layer assignments, and geometric tolerances.
• AP242: Managed model-based 3D engineering. The modern unified standard combining AP203 and AP214 with native support for 3D Product and Manufacturing Information (PMI).

All three protocols store exact mathematical Boundary Representation (B-Rep) geometry comprising topological vertices, edges, loops, faces, shells, and solid bodies.`,
      },
      {
        title: 'What a 3D PDF is and how it differs from a 2D drawing',
        content: `A 3D PDF is a standard PDF container conforming to ISO 32000-1 that embeds an interactive three-dimensional geometry stream rather than flat vector paths or pixel bitmaps:

PRC vs U3D Geometry:
ISO 32000 defines two standard formats for embedding 3D content within PDF files:
• PRC (Product Representation Compact, ISO 14739-1): Specifically engineered for engineering CAD models. PRC provides superior compression algorithms and highly precise representation of boundary representation (B-Rep) curves and tessellated polygonal surfaces.
• U3D (Universal 3D, ECMA-363): An older format commonly used for computer graphics and game asset visualization. PRC has largely superseded U3D in engineering workflows due to higher geometric fidelity and smaller file sizes.

The 2D vs 3D Distinction:
When you export an ordinary 2D PDF from CAD software, the system flattens the 3D model into an orthographic projection, cross-section, or static isometric raster snapshot. Once exported, rotational depth is permanently lost.
In contrast, a genuine 3D PDF embeds the complete three-dimensional polygonal geometry. When opened in a compatible viewer, the recipient can click and drag to orbit around the part, pan across large assemblies, zoom into internal features, and switch between perspective and orthographic camera views.`,
      },
      {
        title: 'Why engineers and designers share CAD models as 3D PDF',
        content: `Distributing engineering models as 3D PDFs solves three fundamental collaboration challenges:

1. Eliminating Software and Licensing Barriers:
Parametric CAD suites (such as SolidWorks, CATIA, Siemens NX, PTC Creo, and Autodesk Inventor) require expensive seat licenses and specialized workstation graphics hardware. Non-engineering project participants—including procurement specialists, machine shop machinists, field installation contractors, and marketing teams—rarely possess CAD software. A 3D PDF allows anyone with a standard desktop PDF viewer to inspect parts interactively.

2. Streamlining Requests for Quotation (RFQs):
When requesting quotes from machine shops or injection molders, suppliers need to evaluate undercut geometry, draft angles, and tooling complexity. Providing a lightweight 3D PDF alongside 2D engineering drawings gives machinists immediate spatial comprehension without requiring them to download gigabytes of native CAD assemblies.

3. Intellectual Property (IP) Protection:
Sharing native CAD files or raw STEP models exposes your complete mathematical geometry, proprietary parametric modeling history, and internal design equations. Competitors or unauthorized vendors can easily modify or clone the design. A tessellated 3D PDF provides visual inspection and dimensional verification while flattening the design tree into a polygonal mesh that cannot be reverse-engineered into a parametric feature tree.`,
      },
      {
        title: 'The STEP to 3D PDF conversion workflow',
        content: `Understanding the architecture of a STEP to 3D PDF conversion pipeline clarifies how CAD models are processed into interactive documents:

Step 1: Ingestion & B-Rep Parsing
The conversion engine parses the ISO 10303-21 entity stream using a CAD modeling kernel (such as Open CASCADE Technology). It interprets the boundary representation (B-Rep) topological entities—such as vertices, edges, faces, and solid shells—and resolves coordinate system transforms for assembly components in an isolated workspace.

Step 2: Deflection-Based Tessellation
Continuous mathematical surfaces (such as NURBS, cylinders, and planes) are discretized into a triangular polygon mesh. The mesher applies controlled linear and angular deflection tolerances to balance visual curvature fidelity against triangle count and file size.

Step 3: Dynamic Bounding Box & Camera Configuration
The engine calculates the model's 3D bounding box coordinates and diagonal extent. It sets an initial perspective camera view targeted at the model center, with appropriate clipping planes so the object displays cleanly upon opening.

Step 4: PRC Compilation & PDF Embedding
The polygon mesh is compiled into a compressed 3D data stream—such as Product Representation Compact (PRC, ISO 14739-1)—and embedded as an interactive 3D annotation inside a standard PDF document.

Step 5: Automated Ephemeral Storage Cleanup
On privacy-conscious web converters like Navorika, uploaded CAD files, intermediate meshes, and generated PDF artifacts are purged automatically from temporary server storage upon task completion. Try the conversion with Navorika's STEP to 3D PDF Converter (/tools/step-to-3d-pdf-converter).`,
      },
      {
        title: 'What geometry and model information survives conversion',
        content: `The data preserved or discarded during conversion depends heavily on the chosen converter, meshing parameters, and target viewer:

What is typically preserved:
• 3D Surface Topology and Envelope: The outer volumetric envelope and surface geometry are preserved as a faceted triangular mesh (or as analytical surfaces in advanced PRC pipelines).
• Spatial Arrangement: Multi-part assemblies maintain their relative positions, alignments, and scale in 3D space. Note that whether individual parts remain selectable as an interactive assembly tree or are combined into a unified visual mesh is implementation-dependent. Navorika's tool creates a consolidated mesh.
• Bounding Dimensions and Proportions: Hole centers, feature spacing, and visual proportions remain faithful to the original design.
• Surface Appearance: Color preservation varies by converter. While AP214 and AP242 STEP protocols can store body or face colors, lightweight or mesh-based pipelines (including Navorika's current pipeline) frequently assign a uniform default neutral shading to maximize rendering reliability.

What is not preserved:
• Parametric Feature History: Sketches, extrusions, cuts, fillets, and parent-child modeling formulas cannot be rolled back or modified.
• Semantic PMI and GD&T: Geometric dimensioning and tolerancing callouts and datum frames do not transfer unless explicitly converted into visual polylines by specialized CAD authoring tools.
• Kinematic Constraints: Dynamic mates, joints, and motion degrees of freedom are frozen in their default coordinates.
• Native Physical Properties: Mass property calculations, material densities, and simulation meshes are stripped from the visual 3D PDF container.`,
      },
      {
        title: 'Desktop Acrobat Reader vs web browser viewing',
        content: `Why Web Browsers Cannot Render 3D PDFs:
Standard web browser PDF engines (Google Chrome's PDFium, Mozilla Firefox's PDF.js, Apple Safari's PDFKit, and Microsoft Edge) are engineered strictly for 2D page display. None of these built-in browser viewers execute Adobe's PRC or U3D 3D runtime modules. When you open a 3D PDF in a web browser tab, you will see a blank canvas, a static placeholder icon, or a notice stating that 3D content requires a standalone viewer.

Recommended Desktop Setup:
To interact with a 3D PDF, save the downloaded file to your local computer and open it in the free desktop version of Adobe Acrobat Reader (Windows or macOS).

Activating 3D Content in Acrobat Reader:
Because 3D streams can theoretically contain interactive JavaScript, Acrobat Reader disables 3D execution by default as a security precaution:
1. When opening the document, a yellow warning banner will appear across the top stating: "3D content has been disabled. Enable this feature if you trust this document."
2. Click the "Options" button on the banner and select "Trust this document always".
3. Alternatively, open Acrobat Preferences (Ctrl+K or Cmd+,), select "3D & Multimedia" in the left sidebar, and check the box for "Enable playing of 3D content".
4. Click anywhere inside the 3D viewport canvas. The interactive 3D toolbar will appear, allowing you to rotate (orbit), pan, spin, zoom, change lighting modes, and select standard orthogonal views.`,
      },
      {
        title: 'Common conversion problems and practical troubleshooting',
        content: `When converting STEP or STP models to 3D PDF, you may encounter the following common scenarios:

1. File Size Exceeds Limits:
Navorika's tool supports files up to 25 MB. Massive production assemblies with thousands of small fasteners (bolts, washers, nuts) can exceed upload thresholds or create millions of polygons that cause PDF viewers to lag.
Solution: Suppress minor internal hardware, defeature small cosmetic rounds, or export major sub-assemblies individually before conversion.

2. Meshing Failures from Corrupt Geometry:
STEP files exported from older CAD software may contain open surface gaps, non-manifold edges, or corrupt topological entity pointers that cause the Open CASCADE mesher to abort.
Solution: Run your CAD software's built-in "Geometry Check" or "Heal Edges" tool prior to export, and ensure your model exports as a closed solid body (Manifold Solid B-Rep).

3. Model Appears Invisible or Microscopic:
The STEP specification defaults to millimeters, but some CAD platforms export in meters or inches without embedding explicit unit tags. If your model appears as a tiny speck or disappears outside the camera view, inspect export unit settings in your source CAD software. In Acrobat Reader, click the "Default View" icon on the 3D toolbar to re-center the camera.

4. Empty Assemblies from External Part References:
If you upload an assembly file that references external part files saved in separate directories, the converter cannot locate the missing components. Always export your assembly as a single, self-contained monolithic STEP file (AP203 or AP214) with all components embedded.`,
      },
      {
        title: 'When to use 3D PDF vs alternative CAD sharing formats',
        content: `Select the appropriate format based on your recipient's downstream requirements:

• Use 3D PDF when: The primary requirement is visual design review, client presentation, RFQ estimating, or assembly floor guidance where recipients only have standard desktop computers and Acrobat Reader.
• Use STEP/STP directly when: The recipient must import the geometry into CAD/CAM software to program CNC mill toolpaths, design injection molding tooling, or perform engineering design changes.
• Use glTF / GLB / USDZ when: You need real-time 3D visualization within web browsers (using Three.js or WebGL), e-commerce interactive product configurators, or smartphone augmented reality (AR).
• Use JT (ISO 14306) when: Working inside large-scale automotive or aerospace enterprise supply chains with dedicated PLM visualization systems.`,
      },
    ],
    [
      {
        question: 'Does converting STEP to 3D PDF reduce the original CAD file size?',
        answer: 'Yes, in most cases. The converter tessellates the CAD model and compiles it into a highly compressed PRC stream, resulting in a lightweight PDF that is easy to attach to emails or distribute over standard office networks.',
      },
      {
        question: 'Can someone reverse-engineer my original CAD model from a 3D PDF?',
        answer: 'No. The conversion flattens the model into a tessellated triangular polygon mesh. Parametric feature trees, sketch dimensions, parent-child dependencies, and internal modeling formulas are permanently discarded.',
      },
      {
        question: 'Why does my 3D PDF show a blank grey box when opened in Google Chrome or Safari?',
        answer: 'Standard web browser PDF viewers use 2D-only rendering engines that do not support Adobe PRC/U3D 3D modules. To view the interactive 3D model, download the PDF to your hard drive and open it in the free desktop Adobe Acrobat Reader.',
      },
      {
        question: 'How do I enable 3D content in Adobe Acrobat Reader?',
        answer: 'Click the "Options" button on the yellow warning bar at the top of Acrobat Reader and select "Trust this document always", or go to Edit → Preferences → 3D & Multimedia and check "Enable playing of 3D content". Click the viewport to activate the 3D toolbar.',
      },
      {
        question: 'Can 3D PDFs be viewed on mobile devices?',
        answer: 'Most mobile PDF readers (including mobile Acrobat Reader) only support 2D PDF rendering. Specialized third-party mobile apps like 3D PDF Reader can render PRC content on iOS and Android, but desktop Acrobat Reader remains the standard viewing environment.',
      },
      {
        question: 'Is STEP AP214 or AP242 supported?',
        answer: 'Yes. Standard ISO 10303-21 STEP entities across AP203, AP214, and AP242 protocols are parsed to extract topological solid and surface boundary geometry. Note that high-level features such as parametric modeling trees, dynamic mates, and semantic PMI annotations do not transfer into the visual polygon mesh.',
      },
    ],
    'Tessellate STEP models into lightweight PRC 3D PDFs for accessible, IP-safe design reviews across non-CAD stakeholders, while reserving raw STEP files for downstream CNC machining and CAD editing.'
  ),

  'rgb-vs-cmyk-for-printing': article(
    'batch-2026-09-rgb',
    'RGB vs CMYK for Printing: Color Modes, Gamuts & Preflight Guide',
    'Learn why RGB and CMYK behave differently, how out-of-gamut shifts happen, how to check image color modes, and how to prepare print-ready artwork.',
    'Designing on a backlit digital screen and printing with physical ink on paper rely on two opposing branches of optical physics: additive light versus subtractive pigment. Understanding the fundamental gap between RGB and CMYK prevents unexpected color shifts, dull printouts, and expensive commercial press reprints.',
    [
      {
        title: 'Additive light vs subtractive pigment: The optical physics',
        content: `The difference between RGB and CMYK stems from the physical behavior of light:

RGB (Additive Light):
RGB (Red, Green, Blue) is an additive color model based on the physics of emitted light. Computer monitors, smartphones, televisions, and digital camera sensors produce color by emitting varying intensities of red, green, and blue light directly into human photoreceptor cells.
• In the absence of light, the screen is black (R:0, G:0, B:0).
• Combining red, green, and blue at full intensity produces pure white light (R:255, G:255, B:255).
• RGB color spaces like sRGB, Adobe RGB (1998), and DCI-P3 encompass a wide chromatic spectrum because glowing phosphors and LEDs can generate high-luminance, saturated colors.

CMYK (Subtractive Pigment):
CMYK (Cyan, Magenta, Yellow, Key/Black) is a subtractive color model based on the physics of reflected light. Printing presses deposit chemical inks, toners, or dyes onto a reflective substrate (such as white paper). The ink pigments act as optical filters that absorb (subtract) specific wavelengths of ambient room light while reflecting the remaining spectrum back to the eye.
• In the absence of ink, the white substrate reflects the full ambient spectrum (paper white).
• Cyan absorbs red light, Magenta absorbs green light, and Yellow absorbs blue light.
• Combining 100% Cyan, Magenta, and Yellow theoretically absorbs all light, but due to chemical impurities in physical pigments, it yields a muddy dark brown.
• Black ink ("Key") is added as a fourth channel to achieve deep optical density, rich shadow contrast, and crisp typographical legibility without oversaturating paper with moisture.`,
      },
      {
        title: 'Gamut mismatch: Why out-of-gamut color shifts occur',
        content: `A color gamut defines the complete range of colors that a specific device, color space, or medium can physically reproduce:

The Gamut Comparison:
When plotted on a CIE 1931 xy chromaticity diagram, the human eye perceives the widest color gamut. RGB color spaces (particularly Adobe RGB and ProPhoto RGB) cover large portions of this visible spectrum, including brilliant electric cyans, radiant neon greens, glowing fluorescent yellows, and saturated purples.
Standard 4-color process inks (CMYK) operate within a noticeably narrower gamut constrained by the chemical properties of commercial pigments, ink viscosity, and paper absorption.

What Happens During RGB to CMYK Conversion:
When an image designed in RGB contains colors outside the printable CMYK gamut ("out of gamut"), those colors cannot physically be printed using standard 4-color process inks.
During color conversion, color management engines apply a "rendering intent" to map out-of-gamut colors to printable values:
• Relative Colorimetric: Shifts out-of-gamut colors to the nearest reproducible color at the edge of the CMYK gamut, leaving in-gamut colors untouched. This preserves exact colors where possible, but can cause subtle color gradients in saturated areas to clip into flat, uniform patches.
• Perceptual: Compresses the entire RGB color space proportionally into the smaller CMYK gamut. This maintains relative visual gradations and smooth tonal transitions across photographs, but slightly desaturates in-gamut colors as well.
• Visible Symptoms of Gamut Clipping: Electric cyan shifts to muted navy blue; vibrant lime green flattens into dull olive; radiant orange turns into rusty brown.`,
      },
      {
        title: 'How to verify an image’s true color space and container headers',
        content: `Web browsers (Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge) are built around the sRGB standard. When a browser displays an image, its 2D rendering pipeline automatically converts pixel data to sRGB before drawing it onto an HTML canvas:

Browser Color Management and Canvas Behavior:
Web browsers are built primarily around standard RGB display color spaces (predominantly sRGB). When an image is rendered on an HTML5 canvas or drawn in the browser viewport, browser engines convert pixel values to an RGB display buffer. Opening a CMYK JPEG directly in certain browser environments can cause color distortion (especially with Adobe YCCK encodings) or conceal the image's underlying multi-channel structure from view. Direct inspection of the container's binary markers reveals the actual color space without display-level conversion.

Binary Header Inspection:
Reliable color space verification requires binary inspection of the raw file headers before display rendering:
• JPEG: Inspecting Start of Frame markers (SOF0 for baseline DCT, SOF2 for progressive DCT). An Nf (number of image components) value of 3 indicates an RGB or YCbCr file; an Nf value of 4 confirms CMYK or Adobe YCCK (verified through the APP14 marker).
• TIFF: Inspecting Image File Directory (IFD) tags defined in the TIFF 6.0 specification:
  - Tag 256 (0x0100): ImageWidth
  - Tag 257 (0x0101): ImageLength (height in scanlines)
  - Tag 262 (0x0106): PhotometricInterpretation. Value 2 indicates RGB full color; value 5 indicates Separated (CMYK process ink separations); values 0 and 1 represent Grayscale.
  - Tag 277 (0x0115): SamplesPerPixel (e.g. 3 for standard RGB, 4 for CMYK or RGBA).
  - Tag 34675 (0x8773): InterColorProfile (embedded ICC profile data).
• PNG: Inspecting the IHDR chunk. The official W3C PNG specification defines five standard color types: Grayscale (0), Truecolor RGB (2), Indexed-color / Palette (3), Grayscale with Alpha (4), and Truecolor with Alpha (6). Standard PNG does not support a native CMYK color model.

Navorika's RGB or CMYK Image Checker (/tools/rgb-cmyk-image-checker) inspects these binary headers client-side in browser memory without canvas color distortion.`,
      },
      {
        title: 'The vital role of embedded ICC color profiles',
        content: `A raw CMYK value (such as C:70 M:30 Y:10 K:0) does not define an absolute, predictable color on its own; it simply instructs printing equipment how much ink volume to deposit. The visual result varies dramatically depending on whether the ink hits glossy coated cardstock, matte recycled paper, or coarse newsprint:

What an ICC Profile Does:
An ICC profile (standardized by the International Color Consortium under ISO 15076-1) provides the mathematical translation matrix between device-dependent color values (RGB or CMYK) and the device-independent CIE L*a*b* reference space.

Standard Commercial Print Profiles:
• North America: GRACoL 2006 Coated (commercial sheet-fed offset printing on premium coated paper), SWOP 2006 (web offset publication printing on coated paper).
• Europe: ISO Coated v2 / Fogra39 (sheet-fed offset on coated paper), PSO Coated v3 / Fogra51 (modern European standard accounting for optical brightening agents).
• Japan: Japan Color 2001 Coated.

Best Practice:
Never convert RGB images using a generic unmanaged conversion. Always request and apply the specific ICC profile recommended by your commercial print provider.`,
      },
      {
        title: 'Format considerations: JPEG, PNG, TIFF, and PDF/X',
        content: `Choosing the correct file format is essential when moving from screen design to commercial prepress:

• PNG (Portable Network Graphics): Standard PNG supports grayscale, RGB, indexed-color palette, and alpha transparency, but does not support a native CMYK color model. It is designed for digital screen display and web delivery rather than direct commercial offset plate separation.
• JPEG (Joint Photographic Experts Group): Supports 4-channel CMYK storage via Adobe YCCK encoding. However, lossy DCT compression creates compression artifacts around sharp vector-like text edges, and many consumer software tools misread CMYK JPEGs.
• TIFF (Tagged Image File Format): The gold standard for uncompressed, lossless raster graphics in commercial prepress. Supports 8-bit and 16-bit CMYK channels, multiple alpha channels, and embedded ICC profiles without lossy compression artifacts.
• PDF/X (ISO 15930): The definitive universal container for complete print layouts. PDF/X-1a enforces strict CMYK and spot colors with flattened transparency; PDF/X-4 supports mixed RGB and CMYK assets with live transparency and embedded ICC profiles, leaving optimal color conversion to the printer's raster image processor (RIP).`,
      },
      {
        title: 'Commercial printing realities: Digital inkjet vs offset workflows',
        content: `Prepress color requirements differ substantially depending on the printing technology:

Digital Plotters and Multi-Channel Inkjets:
Modern large-format inkjet plotters and fine-art giclée printers (such as 8-to-12 channel pigment systems) use ink sets that extend beyond four-color process printing—incorporating photo black, matte black, light cyan, light magenta, gray, and expanded gamut inks such as orange, green, or violet. Many print providers operating these systems prefer receiving high-bit RGB images with embedded wide-gamut ICC profiles (such as Adobe RGB) so their specialized Raster Image Processor (RIP) can map color data directly to the device's extended gamut.

Traditional Offset and High-Speed Press Workflows:
Commercial sheet-fed offset lithography, web offset, flexography, and screen printing operate on four process ink plates (Cyan, Magenta, Yellow, Black) or designated Pantone spot inks. These workflows generally require pre-separated CMYK artwork or standardized PDF/X files tailored to target press profiles (such as GRACoL, SWOP, or Fogra39/51) with established Total Area Coverage (TAC) thresholds.

Best Practice:
Do not assume every print job requires the same color space. Consult your print provider's technical submission guidelines to confirm whether their RIP prefers native CMYK or profiled RGB files.`,
      },
      {
        title: 'Practical pre-print color checklist',
        content: `Follow this 6-point checklist before handing artwork off to a commercial printer:

1. Audit Image File Headers: Preflight image channels using Navorika's RGB or CMYK Image Checker (/tools/rgb-cmyk-image-checker) to confirm format and channel count.
2. Soft-Proof in Design Software: In Photoshop, Illustrator, or CorelDRAW, navigate to View → Proof Setup and choose your printer's target ICC profile. Toggle Proof Colors (Ctrl+Y or Cmd+Y) to inspect out-of-gamut color shifts on-screen.
3. Check Rich Black vs 100% K Black: Ensure body text (below 18pt) and barcodes are set strictly to 100% K (C:0 M:0 Y:0 K:100) rather than 4-color rich black. This prevents registration blur caused by minor press cylinder misalignment.
4. Monitor Total Area Coverage (TAC): Confirm that dense shadow areas do not exceed the press threshold (typically 280%–320% for coated paper, 220%–260% for uncoated).
5. Verify Image Resolution: While 300 ppi is a standard target for close-viewed sheet-fed print, verify that placed images meet the resolution appropriate for the viewing distance and print technology using Navorika's Image Print Size Calculator (/tools/image-print-size-calculator).
6. Export to Standardized PDF/X: Save your final file as PDF/X-1a (pure CMYK) or PDF/X-4 (live transparency with embedded profiles) based on your printer's specifications.`,
      },
    ],
    [
      {
        question: 'Why does my printed flyer look darker and less saturated than it did on my monitor?',
        answer: 'Monitors emit bright light through an expansive RGB color gamut, whereas printed paper reflects ambient light using subtractive CMYK pigments. Colors that were out of gamut on your screen are compressed into darker, less saturated printable alternatives during conversion.',
      },
      {
        question: 'What is the difference between rich black and 100% K black?',
        answer: '100% K black uses only black ink (C:0 M:0 Y:0 K:100) and is essential for small body text and barcodes to avoid registration misalignment. Rich black combines black with cyan, magenta, and yellow (e.g., C:60 M:40 Y:40 K:100) to create a deeper, darker black for large background solids.',
      },
      {
        question: 'Can I convert a PNG to CMYK without quality loss?',
        answer: 'Standard PNG does not support the CMYK color model. To prepare PNG artwork for CMYK printing, open it in an image editor, convert the color mode to CMYK using the print provider’s target ICC profile, and save it as a TIFF, PSD, or PDF/X file.',
      },
      {
        question: 'What happens if I send an RGB file to a commercial offset print shop?',
        answer: 'The print shop’s raster image processor (RIP) will automatically convert the RGB file to CMYK using its own default profile and rendering intent, which may result in unexpected color shifts that you did not review beforehand.',
      },
      {
        question: 'What is the difference between Relative Colorimetric and Perceptual rendering intent?',
        answer: 'Relative Colorimetric shifts only out-of-gamut colors to the nearest printable value, preserving exact in-gamut shades. Perceptual scales all colors proportionally, maintaining smooth tonal gradients across photographs at the cost of slight overall desaturation.',
      },
    ],
    'Preflight file headers to distinguish RGB and CMYK, utilize soft-proofing with printer-specified ICC profiles, and reserve CMYK conversion for commercial offset while consulting inkjet providers on RGB delivery.'
  ),

  'print-bleed-trim-safe-area-guide': article(
    'batch-2026-09-bleed',
    'Print Bleed, Trim & Safe Area Guide: Dimensions, Margins & Setup',
    'Master print layout geometry: bleed, trim line, safe area, and total document size. Includes worked examples for business cards, flyers, and posters.',
    'Commercial print production involves normal cutting, registration, and finishing tolerances during sheet-fed and roll conversion. If documents lack proper bleed and safety margins, small variations during finishing can ruin finished products. Understanding the relationship between bleed, trim line, and safe area ensures consistent edge-to-edge color without risking trimmed text.',
    [
      {
        title: 'The hierarchy of print geometry: Bleed, Trim, and Safe Area',
        content: `Every physical print document is governed by three concentric boundary zones:

1. Bleed Area (Outermost Perimeter):
The bleed area represents the graphic background content extending beyond the intended finished cut line. If your design features photographs, colored panels, or background patterns that touch the edge of the page, they must extend into the bleed area.

2. Trim Line (Middle Boundary):
The trim line marks the exact finished dimension of the printed product. This is where the physical cutting blade drops to slice the paper down to its final size.

3. Safe Area / Live Margin (Innermost Perimeter):
The safe area (or live margin) is the protected zone inside the trim line. All critical textual information, company logos, telephone numbers, legal disclaimers, and barcodes must remain safely inside this boundary.

Why Bleed is Physically Necessary:
During commercial print finishing, printed sheets are trimmed down to final dimensions through mechanical cutting, folding, and binding processes. Because physical materials and cutting equipment operate within normal mechanical and registration tolerances, cut lines can vary slightly. If background artwork stops exactly at the trim line, minor physical movement during trimming can expose an unprinted white sliver along the cut edge. Extending background elements into the bleed area provides the necessary buffer to ensure clean, edge-to-edge color coverage.`,
      },
      {
        title: 'The document sizing formula: Moving from trim to total canvas',
        content: `When establishing your document dimensions in design software, calculate total canvas dimensions using this formula:

Formula:
Total Document Width = Finished Trim Width + (2 × Bleed Allowance)
Total Document Height = Finished Trim Height + (2 × Bleed Allowance)

Why Bleed is Doubled:
Bleed must be applied to all four outer edges: left + right for the horizontal dimension (+2 × bleed), and top + bottom for the vertical dimension (+2 × bleed).

Safe Area Formula:
Safe Area Width = Finished Trim Width - (2 × Safety Margin)
Safe Area Height = Finished Trim Height - (2 × Safety Margin)

You can compute exact setup dimensions, total bleed area, and pixel counts automatically with Navorika's Print Bleed Calculator (/tools/print-bleed-calculator).`,
      },
      {
        title: 'Three practical worked layout examples',
        content: `Review these worked dimensions across common commercial print formats:

Example 1: Standard US Business Card (Imperial)
• Finished Trim Size: 3.50 in × 2.00 in (88.9 mm × 50.8 mm)
• Common Bleed Benchmark: 0.125 in (1/8 inch / ~3.175 mm) per edge (a standard starting example in North American workflows; always confirm with your print provider)
• Total Canvas Setup Dimensions: 3.75 in × 2.25 in (3.50 + 0.25 × 2.00 + 0.25)
• Safety Margin: 0.125 in inside trim line
• Resulting Safe Area: 3.25 in × 1.75 in
• Pixel Dimensions at 300 DPI: Canvas = 1125 × 675 px; Trim = 1050 × 600 px; Safe Area = 975 × 525 px.

Example 2: European A5 Marketing Flyer (Metric)
• Finished Trim Size: 148 mm × 210 mm (5.83 in × 8.27 in)
• Common Bleed Benchmark: 3.0 mm per edge (a standard starting example in European metric workflows; verify provider specifications)
• Total Canvas Setup Dimensions: 154 mm × 216 mm (148 + 6 × 210 + 6)
• Safety Margin: 4.0 mm inside trim line
• Resulting Safe Area: 140 mm × 202 mm
• Pixel Dimensions at 300 DPI: Canvas = 1819 × 2551 px; Trim = 1748 × 2480 px.

Example 3: Large-Format 24" × 36" Display Poster
• Finished Trim Size: 24.0 in × 36.0 in (609.6 mm × 914.4 mm)
• Common Bleed Benchmark: 0.25 in (1/4 inch / 6.35 mm) per edge (or up to 1.5–2.0 inches for canvas gallery wraps around wooden stretcher bars or pole pocket hems)
• Total Canvas Setup Dimensions: 24.5 in × 36.5 in
• Safety Margin: 0.50 in inside trim line
• Resulting Safe Area: 23.0 in × 35.0 in

These dimensions serve as representative worked examples. Exact bleed allowances, safety margins, and finishing requirements vary depending on provider specifications, print technology, and bindery equipment.`,
      },
      {
        title: 'Printer specifications always take precedence',
        content: `There is no single universal bleed specification that applies to all manufacturing:

Factors That Influence Bleed Requirements:
• Saddle-Stitched Booklets: As folded pages nest inside one another, the inner pages protrude outward—a phenomenon known as "creep". Commercial print RIPs adjust page position automatically, but designers must keep ample outer safe margins (at least 6 mm to 8 mm) to avoid clipped page numbers.
• Perfect-Bound Book Spines: Gluing pages into a squared book spine obscures content in the center gutter. Inner margins must expand to 12 mm–15 mm to maintain reading comfort.
• Custom Die-Cut Packaging & Folders: Embossing, foil stamping, and structural die-cutting require specialized structural die lines with custom bleed tolerances specified by the packaging converter.
• Substrate Elasticity: Vinyl banners, fabrics, and heavy corrugated cardboard stretch and shift under tension more than rigid paper cardstock, requiring wider bleed buffers.

Always request your printer's prepress specification sheet or template before creating your document canvas.`,
      },
      {
        title: 'PDF page geometry boxes explained (ISO 32000)',
        content: `Modern commercial prepress relies on ISO 32000 PDF geometry boxes to communicate layout boundaries to automated imposition software:

• MediaBox: The physical paper sheet boundary; encompasses everything including crop marks, registration marks, color bars, and job slug text.
• BleedBox: The perimeter of the page content including bleed extensions. Automated imposition engines read this box to determine cut boundaries when assembling parent press sheets.
• TrimBox: The finished cut size of the page after trimming.
• CropBox: The viewing viewport displayed on screen in desktop PDF readers.
• ArtBox: The boundary of meaningful content within the page.

How to Verify PDF Boxes:
When you export a PDF from InDesign, Illustrator, or CorelDRAW, the application writes explicit coordinates for these boxes into the PDF dictionary.
Navorika's PDF Bleed & Trim Checker (/tools/pdf-bleed-trim-checker) inspects these boxes locally in your browser to confirm whether your PDF has a valid BleedBox larger than its TrimBox.`,
      },
      {
        title: 'Common setup mistakes to avoid',
        content: `Avoid these frequent prepress pitfalls:

1. Designing at Trim Size and Stretching at Export:
Designing artwork at finished trim size and then scaling the canvas up at the last minute distorts proportions, stretches logos, and throws typography out of alignment. Always set bleed during initial document creation.

2. Creating a Fake White Border:
Adding a white border around artwork instead of extending actual background photos and color panels completely defeats the purpose of bleed. If the cut line shifts slightly, the white border will appear uneven.

3. Placing Text on the Trim Line:
Placing text, telephone numbers, or URLs closer than 3 mm to the trim line risks having the blade slice through characters during minor paper shifts.

4. Placing Crop Marks Inside the Bleed Area:
Crop marks must sit strictly outside the BleedBox in the MediaBox margin; otherwise, black lines will be printed into the finished artwork.

5. Forgetting to Enable Bleed at PDF Export:
In Adobe InDesign or Illustrator, you must explicitly check "Use Document Bleed Settings" in the Marks and Bleeds export tab. Otherwise, the software exports only the TrimBox, discarding your bleed artwork.`,
      },
      {
        title: 'Practical pre-export checklist',
        content: `Follow this 6-point checklist before submitting files to a print shop:

1. Calculate Dimensions: Use Navorika's Print Bleed Calculator (/tools/print-bleed-calculator) to determine finished trim, total canvas size, and pixel requirements for your target resolution.
2. Establish Guides: Create guide lines for bleed (red), trim (black), and safe area (blue/green) before laying out assets.
3. Extend Artwork: Extend all background colors, patterns, and full-bleed photographs fully to the outer bleed boundary.
4. Protect Content: Ensure all logos, text frames, and contact details sit safely inside the inner safety margin.
5. Export with Marks & Bleeds: Export to PDF/X-1a or PDF/X-4 with document bleed enabled and trim marks offset outside the bleed zone.
6. Verify PDF Geometry Boxes: Run the exported file through Navorika's PDF Bleed & Trim Checker (/tools/pdf-bleed-trim-checker) to verify that BleedBox and TrimBox dimensions match printer specifications.`,
      },
    ],
    [
      {
        question: 'How much bleed do I need for standard print jobs?',
        answer: 'While 0.125 inches (1/8 inch / ~3.175 mm) in North America and 3.0 mm in metric markets are common starting benchmarks for sheet-fed printing, bleed requirements are not universal. Small stationery, multi-page booklets, packaging dies, and large-format banners may require anywhere from 1.5 mm to 25 mm or more. Always check your print provider’s supplied guidelines or template before setting document bounds.',
      },
      {
        question: 'What is the difference between trim size and bleed size?',
        answer: 'Trim size is the finished dimension of the printed product after cutting. Bleed size is the total canvas dimension including the extra background allowance that extends beyond the trim line to accommodate cutting tolerance.',
      },
      {
        question: 'What is a safe area and why is it necessary?',
        answer: 'The safe area (or live margin) is a boundary typically 3 mm to 5 mm inside the trim line. It guarantees that critical text and logos will not be accidentally trimmed off due to paper shifting under the cutting blade.',
      },
      {
        question: 'Do I need bleed if my design has a pure white background?',
        answer: 'Technically no, because cutting into unprinted white paper leaves no visible white sliver. However, most commercial print shops still mandate standard bleed settings on all submitted files to ensure automated imposition software processes pages without errors.',
      },
      {
        question: 'Why are my crop marks visible on my finished print?',
        answer: 'This happens if crop marks were placed inside the bleed zone or if the mark offset was set to zero. Crop marks must be offset outside the bleed boundary so they are cut away during trimming.',
      },
    ],
    'Establish bleed and safe area guides before designing, extend edge-to-edge artwork past the trim line, and audit exported PDF geometry boxes using prepress checking utilities.'
  ),

  'eps-vs-cdr-guide': article(
    'batch-2026-09-eps',
    'EPS vs CDR: Vector Formats, Print Workflows & Software Compatibility',
    'Compare EPS and CDR vector formats: PostScript language, CorelDRAW native features, transparency limitations, fonts, and print prepress workflows.',
    'In graphic design, signage manufacturing, and commercial print production, vector files are essential for crisp scaling and precise cutlines. Two formats with deep roots in the industry are EPS (Encapsulated PostScript) and CDR (CorelDRAW Drawing). While both can represent vector curves and text, they were built for fundamentally different purposes: EPS as a historic cross-application print interchange format, and CDR as a feature-complete native authoring environment.',
    [
      {
        title: 'Format origins and technical architectures',
        content: `Understanding how EPS and CDR are constructed clarifies their operational boundaries:

EPS (Encapsulated PostScript):
Introduced by Adobe Systems in 1987, EPS is a self-contained PostScript language document conforming to Document Structuring Conventions (DSC). An EPS file contains PostScript programming instructions describing vector geometry, raster bitmaps, and typography within a declared bounding box (%%BoundingBox).
Designed for placement inside desktop publishing layout software (such as Adobe InDesign and QuarkXPress), EPS traditionally includes an optional low-resolution 72 DPI TIFF or WMF bitmap header preview so layout software can display an on-screen preview without executing a full PostScript RIP.

CDR (CorelDRAW Drawing):
The native, proprietary project file format of Corel Corporation's CorelDRAW suite, debuting in 1989.
The internal architecture of CDR files has evolved across software generations:
• Early Versions (v1–v2): Used proprietary binary vector structures.
• CorelDRAW 3 through X3 (v13): Packaged drawing elements within a chunk-based binary format adhering to the Resource Interchange File Format (RIFF) container structure.
• CorelDRAW X4 (v14) and Later: Transitioned to a container structure based on compressed ZIP archives enclosing structured XML documents for object trees, layouts, and styles, alongside media folders for embedded rasters and color profiles.
Throughout its history, CDR is designed as an authoring format engineered to store the complete application state of a CorelDRAW project.`,
      },
      {
        title: 'Transparency, layers, and modern effects',
        content: `The most significant architectural divide between EPS and CDR centers on transparency:

Transparency Limitations in EPS:
The PostScript language was conceived in the 1980s before desktop publishing supported alpha transparency, soft drop shadows, feathering, and blend modes. PostScript (Levels 1, 2, and 3) has no native model for live transparency.
To represent transparent artwork in an EPS, design applications must perform transparency flattening—converting overlapping objects into combinations of opaque vector polygons and sliced raster bitmap segments. This makes subsequent path editing difficult and can occasionally introduce hairline stitching artifacts on high-resolution imagesetters if raster and vector resolutions mismatch.

Live Native Transparency in CDR:
CDR preserves live, non-destructive transparency, gradient opacity, lens effects, contour offsets, and interactive vector mesh fills. Objects remain completely independent, layered, and modifiable throughout the design lifecycle.

Multipage Document Layout:
The Encapsulated PostScript specification (DSC) is architected for single-page encapsulation intended to be embedded as an illustration within a larger document. When exporting a multi-page document to EPS, design applications typically output only the active page or generate a series of individual single-page files. In contrast, CDR is a full multi-page publication engine supporting master layers, facing pages, multi-page numbering, and diverse page orientations within one project file.`,
      },
      {
        title: 'Typography, fonts, and editability',
        content: `Font handling highlights the difference between authoring and interchange:

EPS Font Handling:
EPS files can embed PostScript Type 1, TrueType, or OpenType font programs. However, when an EPS is imported into an illustration program for editing (rather than being placed as a linked image in InDesign), text frames are frequently decomposed into disconnected character strings, broken at line breaks, or forced into vector curves. Once converted to curves, text cannot be retyped, spell-checked, or reflowed.

CDR Font Handling:
CorelDRAW maintains full typographic text streams with paragraph formatting, tracking, kerning, OpenType glyph alternates, and linked text frames across multiple columns and pages. When fonts are embedded in a CDR file, document editability is preserved across collaborative workstations with compatible fonts.`,
      },
      {
        title: 'Industry ecosystems, portability, and software support',
        content: `Each format serves distinct sectors of the graphic design and manufacturing industries:

Where EPS Excels:
EPS was the cross-platform publishing standard for decades. It can be opened or placed in virtually all professional design software: Adobe Illustrator, InDesign, Photoshop, QuarkXPress, FlexiSIGN, SignLab, and vinyl cutter plotters. Major vector stock agencies (Shutterstock, Adobe Stock, Freepik) still distribute vector illustrations as EPS to guarantee backward compatibility with legacy software.

Where CDR Excels:
Inside the global CorelDRAW graphics ecosystem. CorelDRAW is the dominant vector design suite in textile screen printing, garment embroidery, vinyl sign cutting, laser engraving, vehicle wrap design, and packaging across industrial manufacturing hubs. For designers working within CorelDRAW, CDR is the only format that preserves 100% of software-specific features (PowerClip, Extrude, Envelope, Interactive Fill, Contour, and Artistic Media).`,
      },
      {
        title: 'Converting between EPS and CDR: Practical workflows',
        content: `Moving artwork between EPS and CorelDRAW requires specific prepress practices:

EPS to CDR Workflow:
When you receive an EPS asset (such as a stock vector or client logo) to edit in CorelDRAW:
1. In CorelDRAW, go to File → Import (Ctrl+I) and select the EPS file.
2. In the EPS Import dialog, choose "Import text as Curves" if you lack the original fonts to maintain letterform accuracy without PANOSE font substitution.
3. Releasing flattened transparency: Flattened EPS files often arrive as nested clipping masks. Select the artwork and press Ctrl+U (Ungroup) or use Object → PowerClip → Extract Contents (or Effects → PowerClip → Extract Contents in legacy versions) to free vector geometry.
4. Using Navorika's EPS to CDR Converter (/tools/eps-to-cdr-converter): Validates PostScript code in an ephemeral sandbox and prepares clean multi-page PDF, SVG vector paths, or EPS bridges that CorelDRAW can import seamlessly.

CDR to EPS Workflow:
When designing in CorelDRAW and handing off to a legacy print shop, sign cutter, or Adobe-centric client who cannot open .cdr files:
1. In CorelDRAW, go to File → Export (Ctrl+E) and choose "Encapsulated PostScript (*.eps)".
2. Select PostScript Level 3 for modern gradient fills and better color separation handling.
3. Check "Export text as Curves" to prevent font mismatch errors at the recipient's shop.
4. Review transparency flattening: Live drop shadows and soft gradients will be converted to bitmaps during EPS export.
5. Using Navorika's CDR to EPS Converter (/tools/cdr-to-eps-converter): Exports the first page of supported CDR files as clean, DSC-compliant PostScript Level 3 EPS code for quick print interchange.`,
      },
      {
        title: 'The modern alternative: Why PDF/X has replaced EPS',
        content: `In modern commercial printing, PDF/X (ISO 15930, particularly PDF/X-4) has largely superseded EPS as the primary interchange standard in commercial prepress:

Why PDF/X is Superior to EPS:
• Live Transparency: PDF/X-4 supports live transparency groups without slicing vectors into flattened raster strips.
• Embedded ICC Color Management: Enforces standardized color transformations for specific press and paper combinations.
• Multi-Page Support: Easily encapsulates multi-page publications in a single file.
• Standardized Geometry Boxes: Explicitly defines TrimBox and BleedBox for automated imposition software.

Unless an older vinyl cutter, CNC router, or legacy imagesetter specifically demands PostScript EPS, exporting a print-ready PDF/X file from CorelDRAW is universally recommended.`,
      },
    ],
    [
      {
        question: 'Can Adobe Illustrator open CorelDRAW (.cdr) files?',
        answer: 'Adobe Illustrator can open certain older CDR files (versions 5 through 10) on Windows, but does not support modern ZIP/XML-based CorelDRAW files. To move modern CDR artwork to Illustrator, export from CorelDRAW as PDF or EPS.',
      },
      {
        question: 'Does EPS support multi-page drawings?',
        answer: 'No. The EPS specification is strictly single-page. If you export a multi-page CorelDRAW document to EPS, only the current page or a series of numbered single-page files will be generated.',
      },
      {
        question: 'Why does my EPS logo show white lines or jagged edges when printed?',
        answer: 'This is caused by transparency flattening. Because PostScript lacks live transparency, design applications slice overlapping transparent objects into tiled raster bitmaps. Faint white hairline artifacts (stitching) can appear where the tiles meet.',
      },
      {
        question: 'How do I convert an EPS to CDR without losing font formatting?',
        answer: 'If the exact fonts are installed on your computer, choose "Import text as Text" in the CorelDRAW import dialog. If the fonts are missing, choose "Import text as Curves" to preserve letterform shapes without unwanted font substitution.',
      },
      {
        question: 'When should I use EPS instead of SVG or PDF?',
        answer: 'Use EPS when delivering vector cutlines to older vinyl cutting plotters, CNC engraving machines, or legacy screen-printing RIP software that specifically require PostScript Level 2 or Level 3 code.',
      },
    ],
    'Use EPS for legacy vector print and plotter interchange where PostScript is required, CDR for native authoring inside CorelDRAW, and PDF/X for modern commercial print workflows.'
  ),
};
