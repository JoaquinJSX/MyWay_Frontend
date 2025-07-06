import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import EditInfo from "./EditInfo";
import { appContext } from "../../../App";

interface HeaderProps {
    setWhatIsShowing: any;
}

export default function Header({ setWhatIsShowing }: HeaderProps) {

    const navigate = useNavigate();

    const context = useContext(appContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { users, userLoggedIn, setUserLoggedIn } = context;

    const [showingConfig, setShowingConfig] = useState<boolean>(false);
    const [showingProfileInfo, setIsShowingProfileInfo] = useState<boolean>(false);
    const [showingEditInfo, setIsShowingEditInfo] = useState<boolean>(false);

    function deleteAccount() {
        if (window.confirm('Are you sure that you want delete your account?')) {
            fetch(`http://localhost:3000/users/${userLoggedIn?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                alert("Account deleted successfully");
                navigate('/login');
            })
                .catch(error => {
                    console.error('Error deleting goal:', error);
                    alert("Error deleting goal");
                });
        }
    }

    function logOut() {
        setUserLoggedIn(null);
        navigate('/login');
    }

    return (
        <>
            <header>
                <section>
                    <button onClick={() => setShowingConfig(showingConfig ? false : true)}>⇶</button>
                    {showingConfig &&
                        <div>
                            <p onClick={() => setIsShowingProfileInfo(true)}>Profile info</p>
                            {showingProfileInfo &&
                                <UserInfo userLoggedIn={userLoggedIn} />}
                            <p onClick={() => setIsShowingEditInfo(true)}>Edit info</p>
                            {showingEditInfo &&
                                <EditInfo userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} users={users} />}
                            <p onClick={deleteAccount}>Delete account</p>
                            <p onClick={logOut}>Log out</p>
                        </div>}
                </section>
                <h1>{userLoggedIn?.username}</h1>
                <section>
                    <button onClick={() => setWhatIsShowing('pending_tasks')}>Pendings</button>
                    <button onClick={() => setWhatIsShowing('completed_tasks')}>Completed</button>
                </section>
            </header>
        </>
    );
}