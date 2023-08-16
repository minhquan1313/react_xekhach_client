import { createContext } from "react";

const user = createContext({});

function UserContext({ children }) {
  return <user.Provider>{children}</user.Provider>;
}

export default UserContext;
