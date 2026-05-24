import { Download, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import { Loader } from "../components/Loader";
import { TransactionForm } from "../components/TransactionForm";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { DynamicIcon } from "../lib/icons";
import { currency, shortDate } from "../lib/format";
import { api } from "../services/api";
import type { Transaction } from "../types";

const fallbackChartData = [
  { label: "1st Jan", amount: 12000, category: "Salary" },
  { label: "4th Jan", amount: 9400, category: "Freelance" },
  { label: "6th Jan", amount: 9100, category: "E-commerce sales" },
  { label: "7th Jan", amount: 14000, category: "Investment" },
  { label: "8th Jan", amount: 1500, category: "Other" },
  { label: "9th Jan", amount: 7800, category: "Salary" },
  { label: "10th Jan", amount: 10400, category: "Freelance" },
  { label: "11th Jan", amount: 11900, category: "E-commerce sales" },
  { label: "13th Jan", amount: 9500, category: "Investment" },
  { label: "12th Feb", amount: 12000, category: "Salary" }
];

const toIncomeChart = (transactions: Transaction[]) => {
  if (!transactions.length) return fallbackChartData;

  return transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10)
    .map((transaction) => ({
      label: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(transaction.date)),
      amount: transaction.amount,
      category: transaction.category
    }));
};

const IncomeTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { category: string; amount: number } }> }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-md border border-slate-100 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
      <p className="text-sm font-bold text-[#7c3ff2]">{item.category}</p>
      <p className="mt-1 text-base text-[#17141d]">
        Amount: <span className="font-bold">{currency(item.amount)}</span>
      </p>
    </div>
  );
};

const IncomeSources = ({ transactions }: { transactions: Transaction[] }) => {
  if (!transactions.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No income sources yet.
      </div>
    );
  }

  return (
    <div className="grid gap-x-12 gap-y-7 md:grid-cols-2">
      {transactions.map((transaction) => (
        <article key={transaction._id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-[#7c3ff2]">
            <DynamicIcon name={transaction.icon} className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[#2a2830]">{transaction.category}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{shortDate(transaction.date)}</p>
          </div>
          <span className="inline-flex min-w-28 items-center justify-center gap-2 rounded-md bg-[#effdf5] px-4 py-2 text-base font-bold text-[#23c87a]">
            + {currency(transaction.amount)}
            <TrendingUp className="h-4 w-4" />
          </span>
        </article>
      ))}
    </div>
  );
};

export const IncomePage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { data, loading, refetch } = useAsync(() => api.transactions({ type: "income" }), []);

  const addIncome = async (payload: Parameters<typeof api.createTransaction>[0]) => {
    await api.createTransaction({ ...payload, type: "income" });
    toast.success("Income added");
    setShowForm(false);
    refetch();
  };

  const exportIncome = () => {
    window.location.href = api.exportUrl({ type: "income" });
  };

  if (loading || !data || !user) return <Loader />;

  const chartData = toIncomeChart(data.transactions);

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-slate-100 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Income Overview</h1>
            <p className="mt-1 text-base font-medium text-slate-500">
              Track your earnings over time and analyze your income trends.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-3 rounded-md bg-[#f5efff] px-6 py-3 text-base font-bold text-[#8a35df] transition hover:bg-[#eee2ff]"
            onClick={() => setShowForm((current) => !current)}
          >
            <Plus className="h-5 w-5" />
            Add Income
          </button>
        </div>
        <div className="mt-10 h-[390px]">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="#f5f1fb" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#5f5c68", fontSize: 14, fontWeight: 600 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5f5c68", fontSize: 14, fontWeight: 600 }}
                domain={[0, 14000]}
                ticks={[0, 3500, 7000, 10500, 14000]}
              />
              <Tooltip content={<IncomeTooltip />} cursor={{ fill: "rgba(124,63,242,0.04)" }} />
              <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={index % 2 === 0 ? "#7b49ee" : "#c1a9f4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {showForm ? (
          <div className="mt-6">
            <TransactionForm categories={user.categories} defaultType="income" lockType onSubmit={addIncome} onCancel={() => setShowForm(false)} />
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-100 bg-white px-8 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Income Sources</h2>
          <button
            className="inline-flex items-center justify-center gap-3 rounded-md bg-slate-50 px-5 py-3 text-sm font-bold text-[#34313c] transition hover:bg-slate-100"
            onClick={exportIncome}
          >
            <Download className="h-5 w-5" />
            Download
          </button>
        </div>
        <IncomeSources transactions={data.transactions} />
      </section>
    </div>
  );
};
