import { Download, Plus, TrendingDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
  { label: "2nd Jan", amount: 500, category: "Food" },
  { label: "3rd Jan", amount: 180, category: "Transport" },
  { label: "4th Jan", amount: 110, category: "Utilities" },
  { label: "5th Jan", amount: 250, category: "Shopping" },
  { label: "6th Jan", amount: 90, category: "Food" },
  { label: "7th Jan", amount: 610, category: "Travel" },
  { label: "8th Jan", amount: 450, category: "Housing" },
  { label: "9th Jan", amount: 330, category: "Dining out" },
  { label: "10th Jan", amount: 720, category: "Electricity bill" },
  { label: "11th Jan", amount: 810, category: "Shopping" },
  { label: "12th Jan", amount: 870, category: "Travel" },
  { label: "14th Jan", amount: 300, category: "Food" },
  { label: "10th Feb", amount: 610, category: "Entertainment" },
  { label: "11th Feb", amount: 200, category: "Electricity bill" },
  { label: "17th Feb", amount: 430, category: "Shopping" }
];

const toExpenseChart = (transactions: Transaction[]) => {
  if (!transactions.length) return fallbackChartData;

  return transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-15)
    .map((transaction) => ({
      label: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(transaction.date)),
      amount: transaction.amount,
      category: transaction.category
    }));
};

const ExpenseTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { category: string; amount: number } }> }) => {
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

const ExpenseList = ({ transactions, onDelete }: { transactions: Transaction[]; onDelete: (transaction: Transaction) => void }) => {
  if (!transactions.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No expenses yet.
      </div>
    );
  }

  return (
    <div className="grid gap-x-12 gap-y-7 md:grid-cols-2">
      {transactions.map((transaction) => (
        <article key={transaction._id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-2xl text-[#7c3ff2]">
            <DynamicIcon name={transaction.icon} className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[#2a2830]">{transaction.category}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{shortDate(transaction.date)}</p>
          </div>
          <span className="inline-flex min-w-28 items-center justify-center gap-2 rounded-md bg-[#fff2f3] px-4 py-2 text-base font-bold text-[#dd4f62]">
            - {currency(transaction.amount)}
            <TrendingDown className="h-4 w-4" />
          </span>
          <button
            className="rounded-md p-2 text-slate-400 transition hover:bg-[#fff2f3] hover:text-[#dd4f62]"
            onClick={() => onDelete(transaction)}
            aria-label="Delete expense"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </article>
      ))}
    </div>
  );
};

export const ExpensesPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { data, loading, refetch } = useAsync(() => api.transactions({ type: "expense" }), []);

  const addExpense = async (payload: Parameters<typeof api.createTransaction>[0]) => {
    await api.createTransaction({ ...payload, type: "expense" });
    toast.success("Expense added");
    setShowForm(false);
    refetch();
  };

  const deleteExpense = async (transaction: Transaction) => {
    await api.deleteTransaction(transaction._id);
    toast.success("Expense deleted");
    refetch();
  };

  const exportExpenses = () => {
    window.location.href = api.exportUrl({ type: "expense" });
  };

  if (loading || !data || !user) return <Loader />;

  const chartData = toExpenseChart(data.transactions);

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-slate-100 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">Expense Overview</h1>
            <p className="mt-1 text-base font-medium text-slate-500">
              Track your spending trends over time and gain insights into where your money goes.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-3 rounded-md bg-[#f5efff] px-6 py-3 text-base font-bold text-[#8a35df] transition hover:bg-[#eee2ff]"
            onClick={() => setShowForm((current) => !current)}
          >
            <Plus className="h-5 w-5" />
            Add Expense
          </button>
        </div>
        <div className="mt-10 h-[390px]">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3ff2" stopOpacity={0.28} />
                  <stop offset="78%" stopColor="#7c3ff2" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f2eff8" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#5f5c68", fontSize: 14, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#5f5c68", fontSize: 14, fontWeight: 600 }} domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} />
              <Tooltip content={<ExpenseTooltip />} cursor={{ stroke: "#d8d1e8", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="amount" stroke="#7651dc" strokeWidth={4} fill="url(#expenseFill)" dot={{ r: 5, fill: "#7651dc", stroke: "#7651dc" }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {showForm ? (
          <div className="mt-6">
            <TransactionForm categories={user.categories} defaultType="expense" lockType onSubmit={addExpense} onCancel={() => setShowForm(false)} />
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-100 bg-white px-8 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-normal text-[#17141d] dark:text-white">All Expenses</h2>
          <button
            className="inline-flex items-center justify-center gap-3 rounded-md bg-slate-50 px-5 py-3 text-sm font-bold text-[#34313c] transition hover:bg-slate-100"
            onClick={exportExpenses}
          >
            <Download className="h-5 w-5" />
            Download
          </button>
        </div>
        <ExpenseList transactions={data.transactions} onDelete={deleteExpense} />
      </section>
    </div>
  );
};
