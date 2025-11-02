"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/types/transaction";

type Props = {
  data: Transaction[];
};

const TransactionChart = ({ data }: Props) => {
  // Convert data → monthly income/expense totals
  const monthlyTotals: Record<
    string,
    { income: number; expense: number }
  > = {};

  data.forEach((t) => {
    const date = new Date(t.createdAt ?? Date.now()); // fallback if missing
    const month = date.toLocaleString("default", { month: "short" }); // Jan, Feb...

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") monthlyTotals[month].income += t.amount;
    if (t.type === "expense") monthlyTotals[month].expense += t.amount;
  });

  // Convert to array for chart
  const chartData = Object.keys(monthlyTotals).map((month) => ({
    month,
    income: monthlyTotals[month].income,
    expense: monthlyTotals[month].expense,
  }));

  return (
    <div className="bg-white shadow-md p-4 rounded-lg mt-6">
      <h2 className="text-lg font-semibold mb-3 text-center">
        Monthly Income vs Expense
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* ✅ Green income*/}
          <Bar dataKey="income" fill="#16a34a" />

          {/* ✅ Red expense*/}
          <Bar dataKey="expense" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionChart;
