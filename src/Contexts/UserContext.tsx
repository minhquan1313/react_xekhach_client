import { IUser } from "@/Services/IUser";
import { fetcherPost } from "@/Services/fetcher";
import { ReactNode, createContext, useEffect, useState } from "react";

interface IUserContext {
  user: IUser | null;
  isLogging: boolean;
  store: (u: TUserLogin) => void;
  login: (u: TUserLogin) => Promise<boolean>;
  register: (u: TUserRegister) => Promise<boolean>;
  logout: () => void;
  refresh: () => void;
  setUserAvatar: (url: string) => void;
}

const UserContext = createContext<IUserContext>({
  user: null,
  isLogging: false,
  refresh() {},
  store() {},
  logout() {},
  login() {
    return new Promise(() => {});
  },
  register() {
    return new Promise(() => {});
  },
  setUserAvatar: function (): void {},
});

interface IProps {
  children: ReactNode;
}
export type TUserLogin = Pick<IUser, "username" | "password">;
export type TUserRegister = Pick<IUser, "username" | "password" | "firstName">;

function UserProvider({ children }: IProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  const clear = () => {
    console.log(`CLEAR`);

    localStorage.removeItem("user.username");
    localStorage.removeItem("user.password");
  };
  const store = (u: TUserLogin) => {
    localStorage.setItem("user.username", u.username);
    localStorage.setItem("user.password", u.password);
  };
  const get = () => {
    const username = localStorage.getItem("user.username");
    const password = localStorage.getItem("user.password");

    if (username && password) {
      const u: TUserLogin = { username, password };
      return u;
    }
    return null;
  };

  const login = async (u: TUserLogin) => {
    const url = `/login/`;

    setIsLogging(true);

    const d: IUser[] = await fetcherPost(u)(url);

    setIsLogging(false);

    console.log({ d });

    if (d && d[0]) {
      setUser(d[0]);
      return true;
    }

    return false;
  };
  const register = async (u: TUserRegister) => {
    const url = `/register/`;
    try {
      const d: IUser[] = await fetcherPost(u)(url);

      console.log({ d });

      if (d[0]) {
        setUser(d[0]);
        return true;
      }
    } catch (error) {
      /* empty */
    }

    return false;
  };
  const logout = () => {
    if (!user) return;

    clear();
    setUser(null);
  };

  // auto login
  useEffect(() => {
    if (user) return;

    const u = get();

    if (!u) return;

    (async () => {
      const logged = await login(u);

      if (!logged) {
        clear();
      }
    })();
  }, [user]);

  const refresh = () => {
    const u = get();

    if (u) login(u);
  };

  const setUserAvatar = function (url: string): void {
    if (!user) return;

    const { ...rest } = user;

    setUser({ ...rest, avatar: url });
  };
  const value: IUserContext = {
    user,
    isLogging,
    store,
    login,
    logout,
    register,
    refresh,
    setUserAvatar,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
