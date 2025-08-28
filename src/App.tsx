import { useState, useEffect, createContext, useMemo, useContext } from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";

import LogIn from "./LogIn-SignUp/logIn.tsx";
import SignUp from "./LogIn-SignUp/signUp.tsx";
import UI from "./UI/UI.tsx";
import EditInfo from "./UI/MainContent/Header/EditInfo.tsx";
import UserInfo from "./UI/MainContent/Header/UserInfo.tsx";
import OrientationGuard from "./OrientationGuard";

type UserLoggedIn = {
  id: string;
  username: string;
  email: string;
  password: string;
};

type AppContextType = {
  userLoggedIn: UserLoggedIn | null;
  setUserLoggedIn: React.Dispatch<React.SetStateAction<UserLoggedIn | null>>;
  users: UserLoggedIn[];
  setUsers: React.Dispatch<React.SetStateAction<UserLoggedIn[]>>;
};

export const appContext = createContext<AppContextType | undefined>(undefined);

function useAppCtx() {
  const ctx = useContext(appContext);
  if (!ctx) throw new Error("appContext must be used within its Provider");
  return ctx;
}

function RequireAuth() {
  const { userLoggedIn, users } = useAppCtx();
  const noUsers = !users || users.length === 0;
  return userLoggedIn && !noUsers ? <Outlet /> : <Navigate to="/login" replace />;
}

function RedirectIfAuth() {
  const { userLoggedIn, users } = useAppCtx();
  const noUsers = !users || users.length === 0;
  return userLoggedIn && !noUsers ? <Navigate to="/main_content" replace /> : <Outlet />;
}

function App() {
  const [users, setUsers] = useState<UserLoggedIn[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState<UserLoggedIn | null>(() => {
    const stored = localStorage.getItem("userLoggedIn");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    document.title = "MyWay";
    fetch("https://myway-backend.fly.dev/users")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setUsers(data) : setUsers([]))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (userLoggedIn) {
      localStorage.setItem("userLoggedIn", JSON.stringify(userLoggedIn));
    } else {
      localStorage.removeItem("userLoggedIn");
    }
  }, [userLoggedIn]);

  const contextValue = useMemo<AppContextType>(
    () => ({ userLoggedIn, setUserLoggedIn, users, setUsers }),
    [userLoggedIn, users]
  );

  return (
    <div className="App">
      <OrientationGuard>
        <appContext.Provider value={contextValue}>
          <HashRouter>
            <Routes>
              {/* Redirección base: que caiga siempre en main_content;
                  si no está logueado, RequireAuth ya lo manda a /login */}
              <Route path="/" element={<Navigate to="/main_content" replace />} />

              {/* Rutas públicas: si ya está logueado, lo mandamos a /main_content */}
              <Route element={<RedirectIfAuth />}>
                <Route
                  path="/login"
                  element={<LogIn users={users} setUserLoggedIn={setUserLoggedIn} />}
                />
                <Route
                  path="/signup"
                  element={<SignUp users={users} setUsers={setUsers} />}
                />
              </Route>

              {/* Rutas protegidas */}
              <Route element={<RequireAuth />}>
                <Route path="/main_content" element={<UI />} />
                <Route
                  path="/edit_user"
                  element={
                    <EditInfo
                      userLoggedIn={userLoggedIn}
                      setUserLoggedIn={setUserLoggedIn}
                      users={users}
                    />
                  }
                />
                <Route
                  path="/user_info"
                  element={<UserInfo userLoggedIn={userLoggedIn} />}
                />
              </Route>

              {/* 404 simple */}
              <Route path="*" element={<Navigate to="/main_content" replace />} />
            </Routes>
          </HashRouter>
        </appContext.Provider>
      </OrientationGuard>
    </div>
  );
}

export default App;
