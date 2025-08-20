import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './styles.module.css';

interface LogInProps {
    users: any[];
    setUserLoggedIn: any;
}

export default function LogIn({ users, setUserLoggedIn }: LogInProps) {

    const navigate = useNavigate();

    const [emailInput, setEmailInput] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                signIn(event);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [emailInput, passwordInput]);

    useEffect(() => {
        if (emailInput !== '') {
            emailRef.current?.style.removeProperty("border");
            setEmailError("");
        }
    }, [emailInput]);

    useEffect(() => {
        if (passwordInput !== '') {
            passwordRef.current?.style.removeProperty("border");
            setPasswordError("");
        }
    }, [passwordInput]);

    function signIn(e: any) {

        e.preventDefault();

        let userIndex = 0;
        setPasswordError("");

        if (emailInput?.length === 0) {
            setEmailError("Enter email");
            if (emailRef.current) {
                emailRef.current.focus();
                emailRef.current.style.outline = "none";
                emailRef.current.style.border = "1px solid red";
            }
        } else if (!emailInput?.endsWith('@gmail.com')) {
            setEmailError("Enter a valid email");
            if (emailRef.current) {
                emailRef.current.focus();
                emailRef.current.style.outline = "none";
                emailRef.current.style.border = "1px solid red";
            }
        } else if (users.length == 0) {
            setEmailError("User not found");
            if (emailRef.current) {
                emailRef.current.focus();
                emailRef.current.style.outline = "none";
                emailRef.current.style.border = "1px solid red";
            }
        } else {
            for (const i in users) {
                if (users[i].email !== emailInput) {
                    userIndex++;
                    if (userIndex === users.length) {
                        setEmailError("User not found");
                        if (emailRef.current) {
                            emailRef.current.focus();
                            emailRef.current.style.outline = "none";
                            emailRef.current.style.border = "1px solid red";
                        }
                    }
                } else {
                    if (passwordInput?.length === 0) {
                        passwordRef.current?.focus();
                        if (passwordRef.current) {
                            setPasswordError("Enter password");
                            passwordRef.current.style.outline = "none";
                            passwordRef.current.style.border = "1px solid red";
                        }
                    } else if (users[userIndex].password !== passwordInput) {
                        setPasswordError("Incorrect password");
                        passwordRef.current?.focus();
                        if (passwordRef.current) {
                            setPasswordInput('');
                            passwordRef.current.style.outline = "none";
                            passwordRef.current.style.border = "1px solid red";
                        }

                    } else {
                        setUserLoggedIn(users[userIndex]);
                        navigate('/main_content');
                    }
                }
            }
        }
    }

    return (
        <div className={styles.container}>
            <main className={styles.form}>
                <h1>Log In</h1>
                <form>
                    <label>Email:</label><br />
                    <input
                        ref={emailRef}
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                    {emailError && <p className={styles.errorText}>
                        <em>{emailError}</em></p>}
                    {!emailError && <br />}
                    <br />
                    <label>Password:</label><br />
                    <input
                        ref={passwordRef}
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className={passwordError ? styles.errorInput : ""}
                    />
                    {passwordError && <p className={styles.errorText}>
                        <em>{passwordError}</em></p>}
                </form>
                <button onClick={signIn} style={{ marginTop: !passwordError ? "20px" : 0 }}>
                    Enter
                </button><br />
                <Link to={'/signup'}>Don´t have an account?</Link>
            </main>
        </div>
    );
}