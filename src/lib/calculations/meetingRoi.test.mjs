import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMeetingRoi } from './meetingRoi.ts';

test('meeting ROI calculation matches reference Case 1 with positive return', () => {
  const result = calculateMeetingRoi({
    attendees: 8,
    annualCompensation: 80000,
    overheadPercent: 25,
    workingHoursPerYear: 2000,
    durationMinutes: 60,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 50,
    estimatedValuePerMeeting: 1000,
  });

  assert.equal(result.loadedAnnualCompensation, 100000);
  assert.equal(result.hourlyLoadedCost, 50);
  assert.equal(result.attendeeHours, 8);
  assert.equal(result.costPerMeeting, 400);
  assert.equal(result.weeklyMeetingCost, 400);
  assert.equal(result.annualMeetingCount, 50);
  assert.equal(result.annualMeetingCost, 20000);
  assert.ok(Math.abs(result.monthlyMeetingCost - 1666.6666666666667) < 1e-9);
  assert.equal(result.breakEvenValuePerMeeting, 400);
  assert.equal(result.netValuePerMeeting, 600);
  assert.equal(result.estimatedRoiPercent, 150);
});

test('meeting ROI calculation matches reference Case 2 with negative return', () => {
  const result = calculateMeetingRoi({
    attendees: 8,
    annualCompensation: 80000,
    overheadPercent: 25,
    workingHoursPerYear: 2000,
    durationMinutes: 60,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 50,
    estimatedValuePerMeeting: 200,
  });

  assert.equal(result.costPerMeeting, 400);
  assert.equal(result.breakEvenValuePerMeeting, 400);
  assert.equal(result.netValuePerMeeting, -200);
  assert.equal(result.estimatedRoiPercent, -50);
});

test('zero meeting cost returns null ROI rather than Infinity or NaN', () => {
  const zeroCompensation = calculateMeetingRoi({
    attendees: 8,
    annualCompensation: 0,
    overheadPercent: 25,
    workingHoursPerYear: 2080,
    durationMinutes: 60,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 48,
    estimatedValuePerMeeting: 1000,
  });
  assert.equal(zeroCompensation.costPerMeeting, 0);
  assert.equal(zeroCompensation.estimatedRoiPercent, null);

  const zeroAttendees = calculateMeetingRoi({
    attendees: 0,
    annualCompensation: 80000,
    overheadPercent: 25,
    workingHoursPerYear: 2080,
    durationMinutes: 60,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 48,
    estimatedValuePerMeeting: 1000,
  });
  assert.equal(zeroAttendees.costPerMeeting, 0);
  assert.equal(zeroAttendees.estimatedRoiPercent, null);

  const zeroDuration = calculateMeetingRoi({
    attendees: 5,
    annualCompensation: 80000,
    overheadPercent: 25,
    workingHoursPerYear: 2080,
    durationMinutes: 0,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 48,
    estimatedValuePerMeeting: 1000,
  });
  assert.equal(zeroDuration.costPerMeeting, 0);
  assert.equal(zeroDuration.estimatedRoiPercent, null);
});

test('meeting ROI calculation handles default inputs sensibly', () => {
  const result = calculateMeetingRoi({
    attendees: 8,
    annualCompensation: 80000,
    overheadPercent: 25,
    workingHoursPerYear: 2080,
    durationMinutes: 60,
    meetingsPerWeek: 1,
    workingWeeksPerYear: 48,
    estimatedValuePerMeeting: 1000,
  });

  assert.equal(result.loadedAnnualCompensation, 100000);
  assert.ok(Math.abs(result.hourlyLoadedCost - 48.0769) < 0.001);
  assert.equal(result.attendeeHours, 8);
  assert.ok(Math.abs(result.costPerMeeting - 384.615) < 0.001);
  assert.equal(result.annualMeetingCount, 48);
  assert.ok(result.netValuePerMeeting > 0);
  assert.ok(result.estimatedRoiPercent !== null && result.estimatedRoiPercent > 0);
});

test('meeting ROI handles non-finite and negative inputs safely', () => {
  const result = calculateMeetingRoi({
    attendees: Number.NaN,
    annualCompensation: -50000,
    overheadPercent: Number.NaN,
    workingHoursPerYear: 0,
    durationMinutes: -30,
    meetingsPerWeek: -2,
    workingWeeksPerYear: -10,
    estimatedValuePerMeeting: Number.NaN,
  });

  assert.equal(result.attendeesHours, undefined);
  assert.equal(result.attendeeHours, 0);
  assert.equal(result.costPerMeeting, 0);
  assert.equal(result.weeklyMeetingCost, 0);
  assert.equal(result.annualMeetingCost, 0);
  assert.equal(result.monthlyMeetingCost, 0);
  assert.equal(result.netValuePerMeeting, 0);
  assert.equal(result.estimatedRoiPercent, null);
});
