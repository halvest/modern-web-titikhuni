"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  label: string;
  leads: number;
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-blue-600 mt-0.5">
          {payload[0].value ?? 0} lead
        </p>
      </div>
    );
  }
  return null;
};

export default function LeadTrendChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-slate-400">
        Belum ada data lead.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar
          dataKey="leads"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          name="Leads"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
