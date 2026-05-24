import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import type { User } from "../types";

type State = {
  user: User | null;
  loading: boolean;
};

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CATEGORIES"; payload: User["categories"] };

type AuthContextValue = State & {
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setCategories: (categories: User["categories"]) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CATEGORIES":
      return state.user ? { ...state, user: { ...state.user, categories: action.payload } } : state;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { user: null, loading: true });

  useEffect(() => {
    api
      .me()
      .then(({ user }) => dispatch({ type: "SET_USER", payload: user }))
      .catch(() => dispatch({ type: "SET_USER", payload: null }));
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const { user } = await api.login(data);
    dispatch({ type: "SET_USER", payload: user });
    toast.success("Welcome back");
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const { user } = await api.register(data);
    dispatch({ type: "SET_USER", payload: user });
    toast.success("Account created");
  };

  const logout = async () => {
    await api.logout();
    dispatch({ type: "SET_USER", payload: null });
  };

  const setCategories = (categories: User["categories"]) => {
    dispatch({ type: "SET_CATEGORIES", payload: categories });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, setCategories }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
