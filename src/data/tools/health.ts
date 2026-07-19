import { Tool } from "@/types/tool";

export const healthTools: Tool[] = [
  {
    slug: "water-intake-calculator",
    title: "Water Intake Calculator",
    shortDescription: "Calculate your daily water intake based on weight, activity, and climate.",
    description: "Find out how much water you should drink daily based on your weight, activity level, and climate conditions.",
    category: "Health",
    keywords: [
      "Water Intake",
      "Daily Water",
      "Hydration",
      "Water Calculator",
      "Drink Water",
      "Health",
    ],
    featured: true,
    badge: "New",
    heroTitle: "Free Water Intake Calculator",
    heroDescription: "Calculate your daily water intake based on weight, activity level, and climate.",
    formula: "Weight (kg) × 35ml × Activity Multiplier × Climate Multiplier",
    faq: [
      {
        question: "How much water should I drink daily?",
        answer: "A general guideline is 30-35ml per kg of body weight, adjusted for activity and climate."
      },
      {
        question: "Does activity level affect water intake?",
        answer: "Yes, active individuals need more water to compensate for fluid loss through sweat."
      }
    ],
    examples: [
      {
        title: "Example",
        description: "70kg person, moderately active, moderate climate: ~2.5-3 liters per day."
      }
    ],
    relatedTools: [
      "bmi-calculator",
      "calorie-calculator",
      "protein-calculator"
    ]
  }
];
