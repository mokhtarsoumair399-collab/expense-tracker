import { Plus, WalletCards } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { TransactionType } from "../types";

export const CategoryManager = () => {
  const { user, setCategories } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [budget, setBudget] = useState(0);

  const addCategory = async () => {
    if (!name.trim()) return;
    const { categories } = await api.createCategory({ name, type, budget, icon: "CircleDollarSign" });
    setCategories(categories);
    setName("");
    setBudget(0);
    toast.success("Category added");
  };

  const updateBudget = async (categoryName: string, categoryType: TransactionType, value: number) => {
    const { categories } = await api.updateBudget({ name: categoryName, type: categoryType, budget: value });
    setCategories(categories);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2">
        <WalletCards className="h-5 w-5 text-mint" />
        <h2 className="text-base font-semibold text-ink dark:text-white">Categories and budgets</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_150px_130px_auto]">
        <input className="field" placeholder="New category" value={name} onChange={(event) => setName(event.target.value)} />
        <select className="field" value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input className="field" type="number" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
        <button className="btn-primary" onClick={addCategory}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {user?.categories.map((category) => (
          <div
            key={`${category.type}-${category.name}`}
            className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800"
          >
            <div>
              <p className="font-medium text-ink dark:text-white">{category.name}</p>
              <p className="text-xs uppercase text-slate-500">{category.type}</p>
            </div>
            <input
              className="field max-w-32"
              type="number"
              min="0"
              value={category.budget || 0}
              onChange={(event) => updateBudget(category.name, category.type, Number(event.target.value))}
              aria-label={`${category.name} budget`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
