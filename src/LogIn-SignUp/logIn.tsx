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
        } else if (users.length == 0 || users.length === undefined) {
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
            <main className={styles.authCard} role="main" aria-labelledby="login-title">
                <h1 id="login-title" className={styles.title}>Log In</h1>
                <p className={styles.subtitle}>Welcome back</p>

                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            ref={emailRef}
                            type="text"
                            placeholder="you@gmail.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className={`${styles.input} ${emailError ? styles.inputError : ""}`}
                            aria-invalid={!!emailError}
                            aria-describedby={emailError ? "email-error" : undefined}
                        />
                        {emailError && (
                            <p id="email-error" className={styles.errorText}><em>{emailError}</em></p>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            id="password"
                            ref={passwordRef}
                            type="password"
                            placeholder="••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className={`${styles.input} ${passwordError ? styles.inputError : ""}`}
                            aria-invalid={!!passwordError}
                            aria-describedby={passwordError ? "password-error" : undefined}
                        />
                        {passwordError && (
                            <p id="password-error" className={styles.errorText}><em>{passwordError}</em></p>
                        )}
                    </div>
                </form>

                <button onClick={signIn} className={styles.primaryBtn}>Enter</button>

                <div className={styles.mutedRow}>
                    <div className={styles.divider} />
                    <span>Don’t have an account? </span>
                    <Link className={styles.link} to={'/signup'}>Create one</Link>
                </div>
            </main>
        </div>
    );

}