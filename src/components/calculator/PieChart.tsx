"use client";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  principal: number;
  interest: number;
}

export default function PieChart({
  principal,
  interest,
}: PieChartProps) {
  const data: ChartData<"doughnut"> = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        label: "Payment Breakdown",
        data: [principal, interest],
        backgroundColor: [
          "#2563eb",
          "#60a5fa",
        ],
        borderColor: [
          "#2563eb",
          "#60a5fa",
        ],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="mb-6 text-2xl font-bold">
        Payment Breakdown
      </h3>

      <div className="mx-auto max-w-sm">
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}