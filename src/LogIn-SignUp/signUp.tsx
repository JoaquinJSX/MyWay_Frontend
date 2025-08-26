import { useState, useRef, useEffect } from "react";
import styles from './styles.module.css';
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

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
            alert("Enter username");
            return;
        } else if (newUser.username.length < 3) {
            alert("Username must be at least 3 characters long");
            return;
        } else if (users.some(user => user.username === newUser.username)) {
            alert("Username already exists");
            return;
        } else if (newUser.email === null) {
            alert("Enter email");
            return;
        } else if (!newUser.email.endsWith('@gmail.com')) {
            alert("Email must end with @gmail.com");
            return;
        } else if (users.some(user => user.email === newUser.email)) {
            alert("Email is already registered");
            return;
        } else if (newUser.password === null) {
            alert("Enter password");
            return;
        } else if (newUser.password !== null && newUser.password.length < 6) {
            alert("Password must be at least 6 characters long");
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
                navigate('/login');
            }).catch(error => {
                console.error('Error creating user:', error);
                alert("Error creating user");
            });
        }
    }

    return (
        <div className={styles.container}>
            <form>
                Username:
                <input type="text"
                    value={newUser.username ? newUser.username : ''}
                    onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                <br />
                {usernameError && <p className={styles.errorText}>
                    <em>{usernameError}</em></p>}
                {!usernameError && <br />}
                Email:
                <input type="text"
                    value={newUser.email ? newUser.email : ''}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                <br />
                {emailError && <p className={styles.errorText}>
                    <em>{emailError}</em></p>}
                {!emailError && <br />}
                Password:
                <input type="password"
                    value={newUser.password ? newUser.password : ''}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                <br />
                {passwordError && <p className={styles.errorText}>
                    <em>{passwordError}</em></p>}
                {!passwordError && <br />}
                <button onClick={e => createNewUser(e)}>Create</button>
            </form>
        </div>
    );
}