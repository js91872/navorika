interface SummaryProps {
  principal: number;
  interest: number;
  total: number;
}

export default function Summary({
  principal,
  interest,
  total,
}: SummaryProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h3 className="mb-6 text-2xl font-bold">
        Loan Summary
      </h3>

      <div className="space-y-4">

        <SummaryRow
          label="Principal"
          value={principal}
        />

        <SummaryRow
          label="Interest"
          value={interest}
        />

        <SummaryRow
          label="Total Payment"
          value={total}
        />

      </div>

    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <span className="text-slate-600">
        {label}
      </span>

      <span className="font-semibold">
        ₹ {value.toLocaleString()}
      </span>

    </div>
  );
}