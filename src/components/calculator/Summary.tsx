import { formatCurrency } from "@/lib/format/currency";

interface SummaryProps {
  title?: string;

  principalLabel?: string;
  interestLabel?: string;
  totalLabel?: string;

  principal: number;
  interest: number;
  total: number;
}

export default function Summary({
  title = "Summary",

  principalLabel = "Principal",
  interestLabel = "Interest",
  totalLabel = "Total",

  principal,
  interest,
  total,
}: SummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <div className="mt-6 space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-slate-600">
            {principalLabel}
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(principal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">
            {interestLabel}
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(interest)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">

          <span className="font-semibold text-slate-900">
            {totalLabel}
          </span>

          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(total)}
          </span>

        </div>

      </div>

    </div>
  );
}