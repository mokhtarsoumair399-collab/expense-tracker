import type { TransactionType } from "../types";

export const incomeCategories = ["Salary", "Freelance", "E-commerce sales", "Investment", "Other"];

export const expenseCategories = [
  "Dining out",
  "Travel",
  "Shopping",
  "Electricity bill",
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Other"
];

export const chartColors = ["#18a77a", "#e85d4f", "#d9952f", "#57708f", "#8b6fd8", "#2f9cc0", "#d86f9d"];

export const categoryIconMap: Record<string, string> = {
  Salary: "Briefcase",
  Freelance: "Laptop",
  Investment: "TrendingUp",
  "E-commerce sales": "Store",
  Food: "Utensils",
  Transport: "Bus",
  Housing: "Home",
  Utilities: "Plug",
  Entertainment: "Film",
  Shopping: "ShoppingBag",
  "Dining out": "Coffee",
  Travel: "Plane",
  "Electricity bill": "Zap",
  Health: "HeartPulse",
  Education: "GraduationCap",
  Other: "CircleDollarSign"
};

export const categoriesByType = (type: TransactionType) =>
  type === "income" ? incomeCategories : expenseCategories;
