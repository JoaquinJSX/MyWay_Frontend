interface NewUserData {
    username: string;
    email: string;
    password: string;
    handleUsernameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChangeUserData({ username, email, password, handleUsernameChange, handleEmailChange, handlePasswordChange }: NewUserData) {

    return (
        <div>
            Username: <input type="text" value={username} onChange={handleUsernameChange} />
            <br />
            Email: <input type="email" value={email} onChange={handleEmailChange} />
            <br />
            Password: <input type="password" value={password} onChange={handlePasswordChange} />
            <br />
        </div>
    );
}