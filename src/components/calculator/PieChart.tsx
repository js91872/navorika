"use client";

import { useMemo } from "react";

interface PieChartProps {
  principal: number;
  interest: number;
}

export default function PieChart({ principal, interest }: PieChartProps) {
  // Ensure we have valid numbers
  const safePrincipal = Math.max(0, principal || 0);
  const safeInterest = Math.max(0, interest || 0);
  const total = safePrincipal + safeInterest;

  // Calculate percentages
  const principalPercentage = total > 0 ? (safePrincipal / total) * 100 : 0;
  const interestPercentage = total > 0 ? (safeInterest / total) * 100 : 0;

  // Calculate angle for each slice
  const principalAngle = (principalPercentage / 100) * 360;
  const interestAngle = (interestPercentage / 100) * 360;

  // Function to convert angle to coordinates
  const getCoordinates = (angle: number, radius: number) => {
    const radian = ((angle - 90) * Math.PI) / 180;
    return {
      x: radius + radius * Math.cos(radian),
      y: radius + radius * Math.sin(radian),
    };
  };

  // Create path for a slice
  const createSlicePath = (startAngle: number, endAngle: number, radius: number) => {
    const start = getCoordinates(startAngle, radius);
    const end = getCoordinates(endAngle, radius);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${radius} ${radius}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  // If total is 0, show placeholder
  if (total === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-700">Payment Breakdown</h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-slate-400">Enter values to see breakdown</p>
        </div>
      </div>
    );
  }

  const size = 200;
  const radius = 80;
  const center = size / 2;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-700">Payment Breakdown</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {safePrincipal > 0 && (
              <path
                d={createSlicePath(0, principalAngle, radius)}
                fill="#2563eb"
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            )}
            {safeInterest > 0 && (
              <path
                d={createSlicePath(principalAngle, 360, radius)}
                fill="#93c5fd"
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            )}
            {/* Center circle */}
            <circle cx={center} cy={center} r={radius * 0.55} fill="white" />
            <text
              x={center}
              y={center - 6}
              textAnchor="middle"
              className="text-sm font-bold fill-slate-700"
            >
              ₹{total.toLocaleString()}
            </text>
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              className="text-[10px] fill-slate-400"
            >
              Total Amount
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 text-sm">
          {safePrincipal > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-600 flex-shrink-0"></div>
              <div>
                <span className="text-slate-600">Principal</span>
                <span className="ml-2 font-medium text-slate-800">
                  ₹{safePrincipal.toLocaleString()}
                </span>
                <span className="ml-2 text-slate-400">
                  ({principalPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
          {safeInterest > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-300 flex-shrink-0"></div>
              <div>
                <span className="text-slate-600">Interest</span>
                <span className="ml-2 font-medium text-slate-800">
                  ₹{safeInterest.toLocaleString()}
                </span>
                <span className="ml-2 text-slate-400">
                  ({interestPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
