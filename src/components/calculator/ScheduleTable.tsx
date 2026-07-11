import { AmortizationRow } from "@/lib/calculations/amortization";

interface ScheduleTableProps {
  schedule: AmortizationRow[];
}

export default function ScheduleTable({
  schedule,
}: ScheduleTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Amortization Schedule
        </h2>

      </div>

      <div className="max-h-[600px] overflow-auto">

        <table className="w-full">

          <thead className="sticky top-0 bg-slate-50">

            <tr>

              <th className="p-4 text-left">Month</th>

              <th className="p-4 text-right">EMI</th>

              <th className="p-4 text-right">Principal</th>

              <th className="p-4 text-right">Interest</th>

              <th className="p-4 text-right">Balance</th>

            </tr>

          </thead>

          <tbody>

            {schedule.map((row) => (
              <tr
                key={row.month}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-4">
                  {row.month}
                </td>

                <td className="p-4 text-right">
                  ₹ {row.emi.toFixed(0)}
                </td>

                <td className="p-4 text-right">
                  ₹ {row.principal.toFixed(0)}
                </td>

                <td className="p-4 text-right">
                  ₹ {row.interest.toFixed(0)}
                </td>

                <td className="p-4 text-right">
                  ₹ {row.balance.toFixed(0)}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}