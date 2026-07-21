import { Tool } from "@/types/tool";

export const healthTools: Tool[] = [
  {
    slug: "water-intake-calculator",
    title: "Water Intake Calculator",
    shortDescription: "Calculate your daily water intake needs.",
    description: "Calculate your daily water intake based on weight, activity, and climate.",
    category: "Health",
    keywords: ["Water Intake", "Daily Water", "Hydration", "Water Calculator"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Water Intake Calculator",
    heroDescription: "Calculate your daily water intake based on weight, activity level, and climate.",
    formula: "Weight (kg) × 35ml × Activity Multiplier × Climate Multiplier",
    faq: [
      { question: "How much water should I drink daily?", answer: "A general guideline is 30-35ml per kg of body weight, adjusted for activity and climate." },
      { question: "Does activity level affect water intake?", answer: "Yes, active individuals need more water to compensate for fluid loss through sweat." }
    ],
    examples: [
      { title: "Example", description: "70kg person, moderately active, moderate climate: ~2.5-3 liters per day." }
    ],
    relatedTools: ["bmi-calculator", "calorie-calculator", "protein-calculator"]
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    shortDescription: "Calculate your Body Mass Index and health category.",
    description: "Calculate your BMI and understand your health category based on WHO guidelines.",
    category: "Health",
    keywords: ["BMI", "Body Mass Index", "BMI Calculator", "Health"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free BMI Calculator",
    heroDescription: "Calculate your Body Mass Index and understand your health category.",
    formula: "BMI = Weight (kg) / Height (m)²",
    faq: [
      { question: "What is BMI?", answer: "BMI is a measure of body fat based on height and weight." },
      { question: "What is a healthy BMI?", answer: "A healthy BMI is between 18.5 and 24.9." }
    ],
    examples: [
      { title: "Example", description: "70kg, 170cm: BMI = 24.2 (Normal Weight)" }
    ],
    relatedTools: ["bmr-calculator", "calorie-calculator", "protein-calculator"]
  },
  {
    slug: "bmr-calculator",
    title: "BMR Calculator",
    shortDescription: "Calculate your Basal Metabolic Rate and daily calorie needs.",
    description: "Calculate your Basal Metabolic Rate and daily calorie needs based on activity level.",
    category: "Health",
    keywords: ["BMR", "Basal Metabolic Rate", "BMR Calculator", "Calories"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free BMR Calculator",
    heroDescription: "Calculate your Basal Metabolic Rate and daily calorie needs.",
    formula: "Mifflin-St Jeor Equation",
    faq: [
      { question: "What is BMR?", answer: "BMR is the number of calories your body needs to perform basic life-sustaining functions." },
      { question: "How is BMR calculated?", answer: "BMR is calculated using the Mifflin-St Jeor equation based on weight, height, age, and gender." }
    ],
    examples: [
      { title: "Example", description: "70kg male, 170cm, 30 years: BMR = ~1,650 cal/day" }
    ],
    relatedTools: ["bmi-calculator", "calorie-calculator", "protein-calculator"]
  },
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    shortDescription: "Calculate your daily calorie needs and macro recommendations.",
    description: "Calculate your daily calorie needs for maintenance, weight loss, or weight gain.",
    category: "Health",
    keywords: ["Calorie Calculator", "Calories", "Daily Calories", "Macro Calculator"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Calorie Calculator",
    heroDescription: "Calculate your daily calorie needs and macro recommendations.",
    formula: "Calories = BMR × Activity Multiplier",
    faq: [
      { question: "How many calories should I eat?", answer: "It depends on your goals: maintenance, weight loss, or weight gain." },
      { question: "What is the macro split?", answer: "A balanced macro split is 40% carbs, 30% protein, and 30% fat." }
    ],
    examples: [
      { title: "Example", description: "70kg male, 170cm, 30 years, moderate activity: ~2,500 cal/day" }
    ],
    relatedTools: ["bmi-calculator", "bmr-calculator", "protein-calculator"]
  },
  {
    slug: "protein-calculator",
    title: "Protein Intake Calculator",
    shortDescription: "Calculate your daily protein requirements.",
    description: "Calculate your daily protein needs based on weight, activity level, and goals.",
    category: "Health",
    keywords: ["Protein Intake", "Protein Calculator", "Daily Protein", "Protein"],
    featured: true,
    badge: "Popular",
    heroTitle: "Free Protein Intake Calculator",
    heroDescription: "Calculate your daily protein requirements based on your goals.",
    formula: "Protein = Weight (kg) × Protein per kg",
    faq: [
      { question: "How much protein do I need?", answer: "It depends on your activity level and goals, typically 0.8-2.0g per kg of body weight." },
      { question: "What are good protein sources?", answer: "Chicken, fish, eggs, beans, lentils, and dairy products." }
    ],
    examples: [
      { title: "Example", description: "70kg person, moderate activity: ~84g protein per day" }
    ],
    relatedTools: ["bmi-calculator", "calorie-calculator", "water-intake-calculator"]
  }
];
