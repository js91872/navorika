import type { ToolPageContent } from '@/lib/seo/toolPage';

const local =
  'Inputs are processed locally in your browser and are not sent to Navorika.';

export const everydayToolPages: Record<string, ToolPageContent> = {
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
