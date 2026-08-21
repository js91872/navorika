import type { ToolPageContent } from '@/lib/seo/toolPage';

const local =
  'Inputs are processed locally in your browser and are not sent to Navorika.';

export const everydayToolPages: Record<string, ToolPageContent> = {
  'electricity-cost-calculator': {
    slug: 'electricity-cost-calculator',
    name: 'Electricity Cost Calculator',
    category: 'Everyday Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Estimate appliance electricity consumption in kilowatt-hours and running cost from power, daily usage time, billing period, and electricity rate.',
    longTailKeywords: ['electricity cost calculator', 'appliance running cost calculator', 'kwh cost calculator', 'electricity bill appliance calculator'],
    intro: ['Electricity Cost Calculator estimates how much electrical energy an appliance uses and the corresponding running cost.', local],
    formula: [
      { title: 'Energy', body: 'Energy in kWh = power in watts ÷ 1,000 × hours used.' },
      { title: 'Cost', body: 'Electricity cost = energy in kWh × electricity rate per kWh.' },
    ],
    steps: ['Enter appliance wattage.', 'Enter average hours used per day.', 'Enter the number of days and electricity tariff per kWh.', 'Review energy use and estimated daily, monthly, yearly, and selected-period cost.'],
    interpretation: ['The selected-period result represents usage charges based only on the entered energy rate.', 'Daily, 30-day, and annual estimates assume the same daily usage pattern continues.'],
    limitations: ['Actual bills may include taxes, fixed fees, slab tariffs, demand charges, minimum charges, or time-of-use pricing.', 'Rated appliance wattage may differ from real operating consumption.'],
    faqs: [
      { question: 'How do I convert watts to kWh?', answer: 'Divide watts by 1,000 to get kilowatts, then multiply by operating hours.' },
      { question: 'Does this calculate my complete electricity bill?', answer: 'No. It estimates usage cost from the entered per-kWh rate.' },
      { question: 'Can I calculate yearly appliance cost?', answer: 'Yes. The calculator displays a 365-day estimate.' },
    ],
    relatedTools: [{ slug: 'fuel-cost-split-calculator', name: 'Fuel Cost & Passenger Split Calculator' }],
    relatedGuides: [],
  },
  'unit-price-calculator': {
    slug: 'unit-price-calculator',
    name: 'Unit Price Calculator',
    category: 'Everyday Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Compare two products or package sizes by calculating price per unit and identifying the lower-cost option.',
    longTailKeywords: ['unit price calculator', 'price per unit calculator', 'compare package sizes', 'which product is cheaper calculator'],
    intro: ['Unit Price Calculator makes differently sized packages easier to compare by converting both offers to the same price-per-unit basis.', local],
    formula: [{ title: 'Unit price', body: 'Unit price = total product price ÷ quantity.' }],
    steps: ['Enter price and quantity for Option A.', 'Enter price and quantity for Option B.', 'Choose a currency and enter the unit label.', 'Compare unit prices and percentage difference.'],
    interpretation: ['The option with the lower price per identical unit generally offers better value when quality and other product characteristics are comparable.'],
    limitations: ['Only compare equivalent units and comparable products.', 'Discounts, taxes, shipping, loyalty rewards, expiry, and quality differences are not automatically included.'],
    faqs: [
      { question: 'What is unit price?', answer: 'Unit price is the total price divided by the amount or number of units.' },
      { question: 'Can I compare different package sizes?', answer: 'Yes, provided both quantities use the same unit.' },
      { question: 'Can I use kilograms, litres, pieces, or metres?', answer: 'Yes. The unit label is editable.' },
    ],
    relatedTools: [{ slug: 'fuel-cost-split-calculator', name: 'Fuel Cost & Passenger Split Calculator' }],
    relatedGuides: [],
  },
  'aquarium-volume-calculator': {
    slug: 'aquarium-volume-calculator',
    name: 'Aquarium Volume Calculator',
    category: 'Everyday Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate rectangular or cylindrical aquarium capacity and estimate actual water volume in litres, US gallons, UK gallons, and cubic feet.',
    longTailKeywords: [
      'aquarium volume calculator',
      'fish tank volume calculator',
      'aquarium gallons calculator',
      'tank litres calculator',
      'fish tank capacity calculator',
      'cylindrical aquarium volume calculator',
    ],
    intro: [
      'Aquarium Volume Calculator converts tank dimensions into gross capacity and can estimate the actual amount of water after accounting for fill level and displacement from substrate, decor, and equipment.',
      local,
    ],
    formula: [
      {
        title: 'Rectangular aquarium',
        body: 'Volume = length × width × height. When dimensions are in centimetres, dividing cubic centimetres by 1,000 gives litres.',
      },
      {
        title: 'Cylindrical aquarium',
        body: 'Volume = π × radius² × height.',
      },
      {
        title: 'Actual water estimate',
        body: 'Filled volume is adjusted by the selected fill percentage and then reduced by the estimated displacement percentage.',
      },
    ],
    steps: [
      'Choose rectangular or cylindrical tank shape.',
      'Choose centimetres or inches and enter the aquarium dimensions.',
      'Set the approximate water fill level.',
      'Optionally estimate the percentage displaced by substrate, rocks, wood, or equipment.',
      'Review estimated litres, US gallons, UK gallons, and cubic feet.',
    ],
    interpretation: [
      'Gross capacity represents the mathematical internal volume based on the entered dimensions.',
      'Actual water volume is usually lower because aquariums are not filled to the rim and objects inside the tank occupy space.',
    ],
    limitations: [
      'The calculation assumes simple rectangular or cylindrical geometry.',
      'Curved-front, bow-front, corner, irregular, or partitioned aquariums require more detailed measurements.',
      'Glass or acrylic thickness is not automatically deducted.',
      'Displacement percentage is only an estimate and depends on the actual contents of the aquarium.',
    ],
    faqs: [
      {
        question: 'How do I calculate aquarium litres?',
        answer: 'For a rectangular tank measured in centimetres, multiply length × width × height and divide the result by 1,000.',
      },
      {
        question: 'Why is actual water volume lower than tank capacity?',
        answer: 'The tank is normally not filled completely and substrate, decorations, equipment, rocks, and other objects displace water.',
      },
      {
        question: 'Does the calculator support gallons?',
        answer: 'Yes. It displays both US gallons and UK or Imperial gallons.',
      },
      {
        question: 'Can I calculate a cylindrical aquarium?',
        answer: 'Yes. Choose Cylindrical and enter its diameter and height.',
      },
    ],
    relatedTools: [
      { slug: 'fuel-cost-split-calculator', name: 'Fuel Cost & Passenger Split Calculator' },
      { slug: 'barbell-plate-calculator', name: 'Barbell Plate Calculator' },
    ],
    relatedGuides: [],
  },
  'barbell-plate-calculator': {
    slug: 'barbell-plate-calculator',
    name: 'Barbell Plate Calculator',
    category: 'Everyday Calculators',
    applicationCategory: 'UtilitiesApplication',
    description: 'Calculate which weight plates to load on each side of a barbell to reach a target total weight in kilograms or pounds.',
    longTailKeywords: [
      'barbell plate calculator',
      'plate calculator kg',
      'plate calculator pounds',
      'weight plates per side calculator',
      'barbell loading calculator',
    ],
    intro: [
      'Barbell Plate Calculator converts a target total barbell weight into an easy-to-follow plate combination for each side of the bar.',
      local,
    ],
    formula: [
      {
        title: 'Weight available for plates',
        body: 'Total plate weight = target weight - bar weight.',
      },
      {
        title: 'Weight per side',
        body: 'Plate weight per side = total plate weight ÷ 2 because both sides of the bar must be loaded equally.',
      },
      {
        title: 'Plate selection',
        body: 'The calculator selects the largest available plate first and continues with smaller sizes until the closest achievable balanced load is reached.',
      },
    ],
    steps: [
      'Choose kilograms or pounds.',
      'Enter the target total barbell weight.',
      'Select the bar weight.',
      'Review the plate combination required on each side.',
      'If the exact target cannot be reached with the available plate sizes, review the closest lower balanced load.',
    ],
    interpretation: [
      'The displayed plate count is per side, so the same combination should be loaded on both ends of the bar.',
      'Total weight includes the bar itself plus all plates on both sides.',
    ],
    limitations: [
      'The calculator assumes access to the displayed standard plate sizes.',
      'Actual gyms may use different plate inventories or specialty plates.',
      'Collars, clips, chains, bands, and other loading accessories are not included.',
      'Always verify that plates are loaded symmetrically before lifting.',
    ],
    faqs: [
      {
        question: 'Does the target weight include the bar?',
        answer: 'Yes. Enter the total weight you want on the bar, including the bar itself.',
      },
      {
        question: 'Are the displayed plates for one side or both sides?',
        answer: 'The combination shown is for one side. Load the same combination on the opposite side.',
      },
      {
        question: 'Does the calculator support kilograms and pounds?',
        answer: 'Yes. It includes common metric and pound-based plate sizes.',
      },
      {
        question: 'What happens if the exact target cannot be loaded?',
        answer: 'The calculator shows the closest lower balanced weight available from the included plate sizes.',
      },
    ],
    relatedTools: [
      { slug: 'fuel-cost-split-calculator', name: 'Fuel Cost & Passenger Split Calculator' },
    ],
    relatedGuides: [],
  },
  'fuel-cost-split-calculator': {
    slug: 'fuel-cost-split-calculator',
    name: 'Fuel Cost & Passenger Split Calculator',
    category: 'Everyday Calculators',
    applicationCategory: 'UtilitiesApplication',
    description:
      'Estimate fuel consumption, total road-trip cost, and equal cost per passenger using distance, vehicle efficiency, fuel price, and optional trip expenses.',
    longTailKeywords: [
      'fuel cost calculator',
      'trip fuel cost calculator',
      'fuel cost split calculator',
      'road trip cost per person',
      'petrol cost calculator distance mileage',
      'gas cost split calculator',
    ],
    intro: [
      'Fuel Cost & Passenger Split Calculator estimates how much fuel a trip requires, the resulting fuel expense, total shared trip cost, and an equal per-person contribution.',
      local,
    ],
    formula: [
      {
        title: 'km/L',
        body: 'Fuel required in litres = distance in kilometres ÷ kilometres per litre.',
      },
      {
        title: 'L/100 km',
        body: 'Fuel required in litres = distance in kilometres × litres per 100 km ÷ 100.',
      },
      {
        title: 'US MPG',
        body: 'Distance is converted to miles, divided by miles per US gallon, and then gallons are converted to litres.',
      },
      {
        title: 'Passenger share',
        body: 'Cost per person = total trip cost ÷ number of people sharing the trip.',
      },
    ],
    steps: [
      'Enter the one-way journey distance and choose kilometres or miles.',
      'Enter vehicle efficiency in km/L, L/100 km, or US MPG.',
      'Enter the fuel price per litre and number of people sharing the expense.',
      'Optionally mark the journey as a round trip and add tolls, parking, or other costs.',
      'Review fuel required, total trip cost, and each person’s share.',
    ],
    interpretation: [
      'Fuel cost is based on the entered efficiency and assumes the vehicle achieves that average throughout the trip.',
      'Optional toll, parking, and other costs are added to the fuel expense before the total is divided equally between passengers.',
      'Selecting round trip doubles the entered one-way distance.',
    ],
    limitations: [
      'Actual fuel consumption can vary with traffic, speed, terrain, weather, load, tyre pressure, driving style, and vehicle condition.',
      'MPG calculations use US gallons, not Imperial gallons.',
      'The calculator assumes all entered trip expenses are shared equally.',
      'Fuel price is entered per litre even when distance or efficiency is expressed in miles or MPG.',
    ],
    faqs: [
      {
        question: 'How is fuel cost calculated?',
        answer:
          'The calculator first estimates litres of fuel required from distance and vehicle efficiency, then multiplies that quantity by the entered price per litre.',
      },
      {
        question: 'Can I split tolls and parking as well as fuel?',
        answer:
          'Yes. Tolls, parking, and other entered costs are added to the trip total before it is divided between passengers.',
      },
      {
        question: 'Does MPG mean US or UK MPG?',
        answer:
          'The MPG option uses US gallons. Imperial or UK MPG is not currently supported.',
      },
      {
        question: 'Does round trip double the distance?',
        answer:
          'Yes. The entered distance is treated as one way, and enabling Round Trip doubles it.',
      },
      {
        question: 'Is my trip information uploaded?',
        answer:
          'No. The calculation runs locally in your browser.',
      },
    ],
    relatedTools: [],
    relatedGuides: [],
  },
};
