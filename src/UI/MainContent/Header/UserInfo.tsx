export default function UserInfo({userLoggedIn}: any) {

    return(
        <section>
            <h2>User id: {userLoggedIn.id}</h2>
            <h2>Username: {userLoggedIn.username}</h2>
            <h2>Email: {userLoggedIn.email}</h2>
        </section>
    );
}