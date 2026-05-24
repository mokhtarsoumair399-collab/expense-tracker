import type { Category, DashboardData, Transaction, TransactionFilters, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const queryString = (params?: Record<string, string | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(body.message, response.status);
  }

  return response.json();
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: User }>("/auth/me"),
  dashboard: () => request<DashboardData>("/dashboard"),
  categories: () => request<{ categories: Category[] }>("/categories"),
  createCategory: (data: Omit<Category, "custom">) =>
    request<{ categories: Category[] }>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateBudget: (data: Pick<Category, "name" | "type" | "budget">) =>
    request<{ categories: Category[] }>("/categories/budget", { method: "PATCH", body: JSON.stringify(data) }),
  transactions: (filters?: TransactionFilters) =>
    request<{ transactions: Transaction[] }>(`/transactions${queryString(filters as Record<string, string>)}`),
  createTransaction: (data: Partial<Transaction>) =>
    request<{ transaction: Transaction }>("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id: string, data: Partial<Transaction>) =>
    request<{ transaction: Transaction }>(`/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTransaction: (id: string) => request<{ id: string }>(`/transactions/${id}`, { method: "DELETE" }),
  exportUrl: (filters?: TransactionFilters) =>
    `${API_URL}/transactions/export${queryString(filters as Record<string, string>)}`
};
