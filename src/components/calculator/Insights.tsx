interface InsightsProps {
  principal: number;
  interest: number;
  total: number;
}

export default function Insights({
  principal,
  interest,
  total,
}: InsightsProps) {
  const interestPercent =
    total > 0 ? (interest / total) * 100 : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="mb-6 text-2xl font-bold">
        Quick Insights
      </h3>

      <ul className="space-y-4 text-slate-700">
        <li>
          • Interest forms{" "}
          <strong>
            {interestPercent.toFixed(1)}%
          </strong>{" "}
          of your total repayment.
        </li>

        <li>
          • Total interest payable is{" "}
          <strong>
            ₹{Math.round(interest).toLocaleString()}
          </strong>.
        </li>

        <li>
          • Total repayment amount is{" "}
          <strong>
            ₹{Math.round(total).toLocaleString()}
          </strong>.
        </li>

        <li>
          • Principal borrowed is{" "}
          <strong>
            ₹{Math.round(principal).toLocaleString()}
          </strong>.
        </li>
      </ul>
    </div>
  );
}