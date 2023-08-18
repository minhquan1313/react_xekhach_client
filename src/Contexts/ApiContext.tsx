import { ReactNode, createContext } from "react";

const apiUrl = import.meta.env.VITE_API;
const ApiContext = createContext("");

interface IProps {
  children: ReactNode;
}

function ApiProvider({ children }: IProps) {
  const value = apiUrl;

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export { ApiContext, ApiProvider };
