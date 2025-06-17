import { useEffect } from "react";

interface MainProps {
    users: any[];
    userLoggedIn: number | null;
}

export default function Main({users, userLoggedIn}: MainProps) {

    function getUserData() {
        const user = users.find((user) => user.id === userLoggedIn);
        console.log(user);
    }

    useEffect(() => {
        getUserData();
    }, []);

    return(
        <div>
            <h1>What´s going on?</h1>
        </div>
    );
}