import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAsync = <T,>(loader: () => Promise<T>, deps: unknown[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setData(await loader());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, refetch: run, setData };
};
