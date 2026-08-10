import type { MetadataRoute } from 'next';
import { tools, categories } from '@/data/registry';

const baseUrl = 'https://navorika.com';

// Get the current date for the build
const today = new Date();
const oneDayAgo = new Date(today);
oneDayAgo.setDate(oneDayAgo.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages with realistic dates
  const staticPages = [
    { url: baseUrl, lastModified: today }, // Homepage - today
    { url: `${baseUrl}/tools`, lastModified: today },
    { url: `${baseUrl}/categories`, lastModified: oneDayAgo },
    { url: `${baseUrl}/guides`, lastModified: twoDaysAgo },
    { url: `${baseUrl}/about`, lastModified: twoDaysAgo },
    { url: `${baseUrl}/privacy`, lastModified: threeDaysAgo },
  ];

  // Tool pages with dates distributed over the last 5 days
  const toolPages = tools.map((tool, index) => {
    // Distribute dates: earlier tools get older dates, newer tools get newer dates
    const dateIndex = index % 5;
    let date: Date;
    switch(dateIndex) {
      case 0: date = today; break;
      case 1: date = oneDayAgo; break;
      case 2: date = twoDaysAgo; break;
      case 3: date = threeDaysAgo; break;
      case 4: date = fourDaysAgo; break;
      default: date = today;
    }
    
    return {
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: date,
    };
  });

  // Category pages with dates
  const categoryPages = categories.map((category, index) => {
    const dates = [today, oneDayAgo, twoDaysAgo, threeDaysAgo, fourDaysAgo, fiveDaysAgo];
    
    return {
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: dates[index] || today,
    };
  });

  return [...staticPages, ...toolPages, ...categoryPages];
}
