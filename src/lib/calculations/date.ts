export interface DateResult {
  startDate: Date;
  endDate: Date;
  difference: {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    totalYears: number;
  };
  isLeapYear: boolean;
  dayOfWeek: string;
}

export function calculateDateDifference(start: Date, end: Date): DateResult {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[start.getDay()];
  const year = start.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return {
    startDate: start,
    endDate: end,
    difference: {
      years,
      months,
      days,
      totalDays: diffDays,
      totalWeeks: Math.floor(diffDays / 7),
      totalMonths: years * 12 + months,
      totalYears: years + months / 12,
    },
    isLeapYear,
    dayOfWeek,
  };
}

export function addToDate(start: Date, amount: number, unit: string): Date {
  const result = new Date(start);
  switch (unit) {
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }
  return result;
}
