import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appContext } from "../../../App";
import styles from './header.module.css';

interface HeaderProps {
    setWhatIsShowing: any;
}

export default function Header({ setWhatIsShowing }: HeaderProps) {

    const navigate = useNavigate();

    const context = useContext(appContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { userLoggedIn, setUserLoggedIn } = context;

    const [showingConfig, setShowingConfig] = useState<boolean>(false);
    const configRef = useRef<HTMLDivElement>(null);

    // Verify if the user clicked outside the config container
    function handleClickOutside(event: MouseEvent) {
        if (configRef.current && !configRef.current.contains(event.target as Node)) {
            // If clicked outside, close the config container
            setShowingConfig(false);
        }
    };

    // Add event listener for clicks outside the config container
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function deleteAccount() {
        const promptPassword = prompt("Please enter your password to confirm account deletion:");
        if (!promptPassword || promptPassword !== userLoggedIn?.password) {
            alert("Incorrect password. Account deletion cancelled.");
            return;
        } else {
            fetch(`https://myway-backend.fly.dev/users/${userLoggedIn?.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                setUserLoggedIn(null);
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
        <header className={styles.headerContainer}>
            <section>
                <button className={styles.showConfigBtn}
                    onClick={() => setShowingConfig(!showingConfig)}>
                    ⇶
                </button>
                {showingConfig &&
                    <div ref={configRef} className={styles.configContainer}>
                        <p onClick={() => navigate('/user_info')}>Profile info</p>
                        <p onClick={() => navigate('/edit_user')}>Edit info</p>
                        <p onClick={deleteAccount}>Delete account</p>
                        <p onClick={logOut}>Log out</p>
                    </div>}
            </section>
            <h1>{userLoggedIn?.username}</h1>
            <section className={styles.changeContentBtns}>
                <button onClick={() => setWhatIsShowing('pending_tasks')}>Pendings</button>
                <button onClick={() => setWhatIsShowing('completed_tasks')}>Completed</button>
            </section>
        </header>
    );
}