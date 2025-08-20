import { useNavigate } from "react-router-dom";

export default function UserInfo({userLoggedIn}: any) {

    const navigate = useNavigate();

    return(
        <section>
            <button onClick={() => navigate('/main_content')}>Close</button>
            <h2>Username: {userLoggedIn.username}</h2>
            <h2>Email: {userLoggedIn.email}</h2>
            <h2>Created at: {userLoggedIn.created_at}</h2>
        </section>
    );
}