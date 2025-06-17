import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import LogIn from "./LogIn-SignUp/logIn.tsx";
import SignUp from "./LogIn-SignUp/signUp.tsx";
import Welcome from "./UI/Welcome.tsx";
import Main from "./UI/Main.tsx";

function App() {

  useEffect(() => { document.title = 'MyWay.app' }, []);

  const [users, setUsers] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userLoggedIn, setUserLoggedIn] = useState<number | null>(null);

  function getUsers() {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      }
      )
      .catch(error => {
        console.error('Error fetching users:', error);
      }
      );
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LogIn users={users} setLoggedIn={setLoggedIn} setUserLoggedIn={setUserLoggedIn} />} />
          <Route path="/signup" element={<SignUp users={users} setUsers={setUsers} />} />
          <Route path="/main_content" element={<Main users={users} userLoggedIn={userLoggedIn} />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
export default App;