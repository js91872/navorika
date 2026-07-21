export const qrConfig = {
  size: {
    default: 200,
    min: 100,
    max: 500,
    step: 10,
    options: [
      { label: "Small (100px)", value: 100 },
      { label: "Medium (200px)", value: 200 },
      { label: "Large (300px)", value: 300 },
      { label: "XL (400px)", value: 400 },
      { label: "XXL (500px)", value: 500 },
    ],
  },
  errorCorrection: {
    default: "M",
    options: [
      { label: "Low (L)", value: "L" },
      { label: "Medium (M)", value: "M" },
      { label: "High (Q)", value: "Q" },
      { label: "Highest (H)", value: "H" },
    ],
  },
  color: {
    default: "#000000",
    options: [
      { label: "Black", value: "#000000" },
      { label: "Blue", value: "#2563eb" },
      { label: "Red", value: "#dc2626" },
      { label: "Green", value: "#16a34a" },
      { label: "Purple", value: "#7c3aed" },
    ],
  },
} as const;
