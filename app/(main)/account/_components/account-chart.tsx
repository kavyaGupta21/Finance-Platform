"use client";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { useMemo, useState } from "react";
import { startOfDay } from "date-fns/startOfDay";
import { subDays } from "date-fns/subDays";
import { format } from "date-fns/format";
import { endOfDay } from "date-fns/endOfDay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer } from "recharts";

type DateRangeKey = keyof typeof DATE_RANGES;

interface Transaction {
  date: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
}

interface AccountChartProps {
  transactions: Transaction[];
}

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last 1 Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  "1Y": { label: "Last 1 Year", days: 365 },
  ALL: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }: AccountChartProps) => {
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // filter transactions within date range
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now),
    );
    const grouped = filtered.reduce<
      Record<string, { date: string; income: number; expense: number }>
    >((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 },
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex  items-start sm:flex-row sm:justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-bold">Transaction View</CardTitle>
        <Select
          defaultValue={dateRange}
          onValueChange={(value) => setDateRange(value as DateRangeKey)}
        >
          <SelectTrigger className="w-180">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => {
              return (
                <SelectItem key={key} value={key as DateRangeKey}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-8   bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-green-600">Total Income</p>
            <p>${totals.income.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-red-600">Total Expenses</p>
            <p>${totals.expense.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-blue-600">Net Balance</p>
            <p
              className={`text-lg font-bold ${totals.income - totals.expense >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div
          className="w-full min-w-0 min-h-0"
          style={{ width: "100%", minWidth: 0, minHeight: 0, height: 300 }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <BarChart
              data={filteredData}
              margin={{
                top: 15,
                right: 20,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip formatter={(value) => [`$${value}`, undefined]} />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#8884d8"
                activeBar={{ fill: "pink", stroke: "blue" }}
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#82ca9d"
                activeBar={{ fill: "gold", stroke: "purple" }}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
