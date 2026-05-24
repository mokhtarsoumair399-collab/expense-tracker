import { Download, Filter, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CategoryManager } from "../components/CategoryManager";
import { Loader } from "../components/Loader";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionTable } from "../components/TransactionTable";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { api } from "../services/api";
import type { Transaction, TransactionFilters, TransactionType } from "../types";

const cleanFilters = (filters: TransactionFilters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value)) as TransactionFilters;

export const TransactionsPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [editing, setEditing] = useState<Transaction | null>(null);
  const { data, loading, refetch } = useAsync(() => api.transactions(cleanFilters(filters)), [filters]);

  const submit = async (payload: Partial<Transaction>) => {
    if (editing) {
      await api.updateTransaction(editing._id, payload);
      toast.success("Transaction updated");
      setEditing(null);
    } else {
      await api.createTransaction(payload);
      toast.success("Transaction added");
    }
    refetch();
  };

  const remove = async (transaction: Transaction) => {
    await api.deleteTransaction(transaction._id);
    toast.success("Transaction deleted");
    refetch();
  };

  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  if (loading || !data || !user) return <Loader />;

  const categoryOptions = user.categories.filter((category) => (filters.type ? category.type === filters.type : true));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, edit, export, and manage your categories.</p>
        </div>
        <button className="btn-secondary" onClick={() => (window.location.href = api.exportUrl(cleanFilters(filters)))}>
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink dark:text-white">
          <Filter className="h-5 w-5 text-steel" />
          Filters
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <input className="field" placeholder="Search description" value={filters.search || ""} onChange={(event) => updateFilter("search", event.target.value)} />
          <select className="field" value={filters.type || ""} onChange={(event) => updateFilter("type", event.target.value as TransactionType | "")}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="field" value={filters.category || ""} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="">All categories</option>
            {categoryOptions.map((category) => (
              <option key={`${category.type}-${category.name}`} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="field" type="date" value={filters.startDate || ""} onChange={(event) => updateFilter("startDate", event.target.value)} />
          <input className="field" type="date" value={filters.endDate || ""} onChange={(event) => updateFilter("endDate", event.target.value)} />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink dark:text-white">
          <Plus className="h-5 w-5 text-mint" />
          {editing ? "Edit transaction" : "Add transaction"}
        </h2>
        <TransactionForm categories={user.categories} editing={editing} onSubmit={submit} onCancel={editing ? () => setEditing(null) : undefined} />
      </section>

      <section className="grid gap-3">
        <h2 className="text-base font-semibold text-ink dark:text-white">All transactions</h2>
        <TransactionTable transactions={data.transactions} onEdit={setEditing} onDelete={remove} />
      </section>

      <CategoryManager />
    </div>
  );
};
