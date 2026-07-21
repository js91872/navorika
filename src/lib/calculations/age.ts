export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
  zodiacSign: string;
  dayOfWeek: string;
  isLeapYear: boolean;
  ageInSeconds: number;
}

export function calculateAge(birthDate: Date, currentDate: Date = new Date()): AgeResult {
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const ageInSeconds = Math.floor((currentDate.getTime() - birthDate.getTime()) / 1000);

  // Next birthday
  const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < currentDate) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.floor((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  // Zodiac sign
  const zodiacSigns = [
    { sign: "Capricorn", start: [1, 1], end: [1, 19] },
    { sign: "Aquarius", start: [1, 20], end: [2, 18] },
    { sign: "Pisces", start: [2, 19], end: [3, 20] },
    { sign: "Aries", start: [3, 21], end: [4, 19] },
    { sign: "Taurus", start: [4, 20], end: [5, 20] },
    { sign: "Gemini", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", start: [6, 21], end: [7, 22] },
    { sign: "Leo", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", start: [8, 23], end: [9, 22] },
    { sign: "Libra", start: [9, 23], end: [10, 22] },
    { sign: "Scorpio", start: [10, 23], end: [11, 21] },
    { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
    { sign: "Capricorn", start: [12, 22], end: [12, 31] },
  ];

  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  let zodiacSign = "";
  for (const z of zodiacSigns) {
    if ((month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1])) {
      zodiacSign = z.sign;
      break;
    }
  }

  // Day of week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[birthDate.getDay()];

  // Leap year
  const year = birthDate.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    nextBirthday,
    daysUntilNextBirthday,
    zodiacSign,
    dayOfWeek,
    isLeapYear,
    ageInSeconds,
  };
}
