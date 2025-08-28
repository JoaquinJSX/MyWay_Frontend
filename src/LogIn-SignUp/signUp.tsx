import { useState, useRef, useEffect, useContext } from "react";
import styles from './styles.module.css';
import { Link } from "react-router-dom";
import { appContext } from "../App";

interface SignUpProps {
    users: any[];
    setUsers: any;
}

interface newUserObject {
    username: string | null;
    email: string | null;
    password: string | null;
}

export default function SignUp({ users, setUsers }: SignUpProps) {

    const context = useContext(appContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { setUserLoggedIn } = context;

    const [newUser, setNewUser] = useState<newUserObject>({ username: null, email: null, password: null });
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                createNewUser(event);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [newUser.username, newUser.email, newUser.password]);

    useEffect(() => {
        if (newUser.username !== null) {
            usernameRef.current?.style.removeProperty("border");
            setUsernameError("");
        }
    }, [newUser.username]);

    useEffect(() => {
        if (newUser.email !== null) {
            emailRef.current?.style.removeProperty("border");
            setEmailError("");
        }
    }, [newUser.email]);

    useEffect(() => {
        if (newUser.password !== null) {
            passwordRef.current?.style.removeProperty("border");
            setPasswordError("");
        }
    }, [newUser.password]);

    function createNewUser(e: any) {

        e.preventDefault();

        if (newUser.username === null) {
            setUsernameError("Enter username");
            return;
        } else if (newUser.username.length < 3) {
            setUsernameError("Username must be at least 3 characters long");
            return;
        } else if (users.some(user => user.username === newUser.username)) {
            setUsernameError("Username already exists");
            return;
        } else if (newUser.email === null) {
            setEmailError("Enter email");
            return;
        } else if (!newUser.email.endsWith('@gmail.com')) {
            setEmailError("Email must end with @gmail.com");
            return;
        } else if (users.some(user => user.email === newUser.email)) {
            setEmailError("Email is already registered");
            return;
        } else if (newUser.password === null) {
            setPasswordError("Enter password");
            return;
        } else if (newUser.password !== null && newUser.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        } else {
            fetch('https://myway-backend.fly.dev/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            }).then(res => {
                if (!res.ok) throw new Error("Create user failed");
                return res.json();
            }).then((data) => {
                setUsers([...users, data.user]);
                setUserLoggedIn(data.user);
            }).catch(error => {
                console.error('Error creating user:', error);
                alert("Error creating user");
            });
        }
    }

    return (
        <div className={styles.container}>
            <main className={styles.authCard} role="main" aria-labelledby="signup-title">
                <h1 id="signup-title" className={styles.title}>Create account</h1>
                <p className={styles.subtitle}>Start your journey</p>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="username">Username</label>
                        <input
                            id="username"
                            ref={usernameRef}
                            type="text"
                            placeholder="Your nickname"
                            value={newUser.username ? newUser.username : ''}
                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                            className={`${styles.input} ${usernameError ? styles.inputError : ""}`}
                            aria-invalid={!!usernameError}
                        />
                        {usernameError && (
                            <p className={styles.errorText}><em>{usernameError}</em></p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            ref={emailRef}
                            type="text"
                            placeholder="you@gmail.com"
                            value={newUser.email ? newUser.email : ''}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            className={`${styles.input} ${emailError ? styles.inputError : ""}`}
                            aria-invalid={!!emailError}
                        />
                        {emailError && (
                            <p className={styles.errorText}><em>{emailError}</em></p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="signup-pass">Password</label>
                        <input
                            id="signup-pass"
                            ref={passwordRef}
                            type="password"
                            placeholder="At least 6 characters"
                            value={newUser.password ? newUser.password : ''}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            className={`${styles.input} ${passwordError ? styles.inputError : ""}`}
                            aria-invalid={!!passwordError}
                        />
                        {passwordError && (
                            <p className={styles.errorText}><em>{passwordError}</em></p>
                        )}
                    </div>
                </form>

                <button onClick={e => createNewUser(e)} className={styles.primaryBtn}>
                    Create account
                </button>

                <div className={styles.mutedRow}>
                    <div className={styles.divider} />
                    <Link className={styles.link} to="/login">Back to Log In</Link>
                </div>
            </main>
        </div>
    );
}