const n = (value: number | undefined) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0);

export interface MeetingRoiInput {
  attendees: number;
  annualCompensation: number;
  overheadPercent?: number;
  workingHoursPerYear?: number;
  durationMinutes: number;
  meetingsPerWeek?: number;
  workingWeeksPerYear?: number;
  estimatedValuePerMeeting?: number;
}

export interface MeetingRoiResult {
  [key: string]: number | null;
  loadedAnnualCompensation: number;
  hourlyLoadedCost: number;
  attendeeHours: number;
  costPerMeeting: number;
  weeklyMeetingCost: number;
  annualMeetingCount: number;
  annualMeetingCost: number;
  monthlyMeetingCost: number;
  breakEvenValuePerMeeting: number;
  netValuePerMeeting: number;
  estimatedRoiPercent: number | null;
}

export function calculateMeetingRoi(input: MeetingRoiInput): MeetingRoiResult {
  const attendees = Math.floor(n(input.attendees));
  const annualCompensation = n(input.annualCompensation);
  const overheadPercent = Math.min(200, n(input.overheadPercent));
  const workingHoursPerYear = n(input.workingHoursPerYear);
  const durationMinutes = n(input.durationMinutes);
  const meetingsPerWeek = n(input.meetingsPerWeek);
  const workingWeeksPerYear = Math.min(52, n(input.workingWeeksPerYear));
  const estimatedValuePerMeeting = n(input.estimatedValuePerMeeting);

  const loadedAnnualCompensation = annualCompensation * (1 + overheadPercent / 100);
  const hourlyLoadedCost = workingHoursPerYear > 0 ? loadedAnnualCompensation / workingHoursPerYear : 0;
  const attendeeHours = (attendees * durationMinutes) / 60;
  const costPerMeeting = hourlyLoadedCost * attendeeHours;

  const weeklyMeetingCost = costPerMeeting * meetingsPerWeek;
  const annualMeetingCount = meetingsPerWeek * workingWeeksPerYear;
  const annualMeetingCost = costPerMeeting * annualMeetingCount;
  const monthlyMeetingCost = annualMeetingCost / 12;

  const breakEvenValuePerMeeting = costPerMeeting;
  const netValuePerMeeting = estimatedValuePerMeeting - costPerMeeting;
  const estimatedRoiPercent = costPerMeeting > 0 ? (netValuePerMeeting / costPerMeeting) * 100 : null;

  return {
    loadedAnnualCompensation,
    hourlyLoadedCost,
    attendeeHours,
    costPerMeeting,
    weeklyMeetingCost,
    annualMeetingCount,
    annualMeetingCost,
    monthlyMeetingCost,
    breakEvenValuePerMeeting,
    netValuePerMeeting,
    estimatedRoiPercent,
  };
}
