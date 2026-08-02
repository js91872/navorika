'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface InvestmentChartProps {
  data: Array<{
    year: number;
    value: number;
    contributions?: number;
    returns?: number;
  }>;
  type?: 'line' | 'area' | 'pie';
  height?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export function InvestmentChart({
  data,
  type = 'line',
  height = 300,
  colors = DEFAULT_COLORS,
}: InvestmentChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400">
        No data available
      </div>
    );
  }

  if (type === 'pie') {
    const pieData = data.slice(0, 6).map((item, index) => ({
      name: `Year ${item.year}`,
      value: item.value,
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="year" 
          label={{ value: 'Year', position: 'bottom' }}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
          label={{ value: 'Amount (₹)', angle: -90, position: 'left' }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Legend />
        {data[0]?.contributions !== undefined && (
          <DataComponent
            type="monotone"
            dataKey="contributions"
            stroke="#10b981"
            fill="#10b981"
            name="Contributions"
            strokeWidth={2}
          />
        )}
        <DataComponent
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          fill={type === 'area' ? '#6366f1' : undefined}
          name="Portfolio Value"
          strokeWidth={2}
          fillOpacity={0.1}
        />
        {data[0]?.returns !== undefined && (
          <DataComponent
            type="monotone"
            dataKey="returns"
            stroke="#f59e0b"
            fill="#f59e0b"
            name="Returns"
            strokeWidth={2}
          />
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
