import { useSearchParams } from "react-router";

type QueryParamsObject = Record<
  string,
  string
>;

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) ?? defaultValue;
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "" || value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  const setMultipleParams = (obj: QueryParamsObject) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(obj).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    setSearchParams(params);
  };

  return {
    getParam,
    setParam,
    setMultipleParams,
    searchParams,
  };
}
