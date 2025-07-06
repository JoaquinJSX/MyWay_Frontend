import { useState, useRef, useEffect } from "react";

interface EditUserProps {
    users: any[];
    userLoggedIn: any;
    setUserLoggedIn: any;
}

interface EditedUserProps {
    username: string;
    email: string;
    password: string;
}

export default function EditInfo({ userLoggedIn, setUserLoggedIn, users }: EditUserProps) {

    const [editedUser, setEditedUser] = useState<EditedUserProps>({
        username: userLoggedIn.username,
        email: userLoggedIn.email,
        password: ''
    });

    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                editUser();
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [editedUser.username, editedUser.email, editedUser.password]);

    useEffect(() => {
        if (editedUser.username !== '') {
            usernameRef.current?.style.removeProperty("border");
            setUsernameError("");
        }
    }, [editedUser.username]);

    useEffect(() => {
        if (editedUser.email !== '') {
            emailRef.current?.style.removeProperty("border");
            setEmailError("");
        }
    }, [editedUser.email]);

    useEffect(() => {
        if (editedUser.password !== '') {
            passwordRef.current?.style.removeProperty("border");
            setPasswordError("");
        }
    }, [editedUser.password]);

    function editUser() {
        if (editedUser.username === '') {
            alert("Enter username");
            return;
        } else if (editedUser.username.length < 3) {
            alert("Username must be at least 3 characters long");
            return;
        } else if (users.some(user => user.username === editedUser.username)) {
            alert("Username already exists");
            return;
        } else if (editedUser.email === '') {
            alert("Enter email");
            return;
        } else if (!editedUser.email.endsWith('@gmail.com')) {
            alert("Email must end with @gmail.com");
            return;
        } else if (users.some(user => user.email === editedUser.email && editedUser.email !== userLoggedIn.email)) {
            alert("Email is already registered");
            return;
        } /* else if (editedUser.password === '') {
            setEditedUser({ ...editedUser, password: userLoggedIn.password });
            return;
        } */ else if (editedUser.password !== '' && editedUser.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        } else {
            fetch(`http://localhost:3000/users/${userLoggedIn.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...editedUser, password: userLoggedIn.password})
            }).then(() => {
                fetch(`http://localhost:3000/users/${userLoggedIn.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => setUserLoggedIn(data))
                    .catch(error => console.error('Fetch error:', error)); // Add this catch block
            })
                .catch(error => {
                    console.error('Error updating user:', error);
                    alert("Error updating user");
                });
        }
    }

    return (
        <section>
            <h3>Change username</h3>
            <input type="text"
                value={editedUser.username}
                onChange={e => setEditedUser({ ...editedUser, username: e.target.value })}
            />
            <h3>Change email</h3>
            <input type="text"
                value={editedUser.email}
                onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
            />
            <h3>Change password</h3>
            <input type="text"
                value={editedUser.password}
                onChange={e => setEditedUser({ ...editedUser, password: e.target.value })}
            />
            <br />
            <button onClick={editUser}>Send</button>
        </section>
    );
}