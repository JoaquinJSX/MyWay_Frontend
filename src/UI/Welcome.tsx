import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface WelcomeProps {
    users: any[];
    userLoggedIn: string;
}

export default function Welcome() {

    const navigate = useNavigate();

    /* function getUserName() {
        
    } */

    function appearLogIn() {
    setTimeout(() => navigate('/login'), 5000);
  }

  useEffect(() => {
    appearLogIn();
  }, []);

    return(
        <div>
            Welcome to MyWay, achieve what you want to your ritm, you can do anything.
        </div>
    );
}