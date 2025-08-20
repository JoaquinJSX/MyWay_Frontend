import { useState, useEffect, createContext } from "react";
import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./App.css";

import LogIn from "./LogIn-SignUp/logIn.tsx";
import SignUp from "./LogIn-SignUp/signUp.tsx";
import UI from "./UI/UI.tsx";
import EditInfo from "./UI/MainContent/Header/EditInfo.tsx";
import UserInfo from "./UI/MainContent/Header/UserInfo.tsx";
import OrientationGuard from "./OrientationGuard";

type userLoggedInTypes = {
  id: string;
  username: string;
  email: string;
  password: string;
};

type appContextType = {
  userLoggedIn: userLoggedInTypes | null;
  setUserLoggedIn: React.Dispatch<React.SetStateAction<userLoggedInTypes | null>>;
  users: userLoggedInTypes[];
};

export const appContext = createContext<appContextType | undefined>(undefined);

function App() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    document.title = "MyWay";
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const [userLoggedIn, setUserLoggedIn] = useState<userLoggedInTypes | null>(() => {
    const storedUser = localStorage.getItem("userLoggedIn");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (userLoggedIn !== null) {
      localStorage.setItem("userLoggedIn", JSON.stringify(userLoggedIn));
    } else {
      localStorage.removeItem("userLoggedIn");
    }
  }, [userLoggedIn]);

  const contextValue: appContextType = {
    userLoggedIn,
    setUserLoggedIn,
    users,
  };

  return (
    <div className="App">
      <OrientationGuard>
        <HashRouter>
          <Routes>
            <Route path="/" element={<div>Welcome to <Link to={'/login'}>MyWay App</Link></div>} />
            <Route path="/login" element={<LogIn users={users} setUserLoggedIn={setUserLoggedIn} />} />
            <Route path="/signup" element={<SignUp users={users} setUsers={setUsers} />} />
            <Route
              path="/main_content"
              element={
                userLoggedIn !== null ? (
                  <appContext.Provider value={contextValue}>
                    <UI />
                  </appContext.Provider>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/edit_user" element={<EditInfo userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} users={users} />} />
            <Route path="/user_info" element={<UserInfo userLoggedIn={userLoggedIn} />} />
          </Routes>
        </HashRouter>
      </OrientationGuard>
    </div>
  );
}

export default App;