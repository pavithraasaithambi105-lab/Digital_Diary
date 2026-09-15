import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
    const savedUser = localStorage.getItem("user");

    const [user, setUser] = useState(
        savedUser ? JSON.parse(savedUser) : null
    );

    const [page, setPage] = useState("login");

    const handleLogin = (loggedInUser) => {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setPage("login");
    };

    if (user) {
        const theme =
            user.gender === "male" ? "male-theme" : "female-theme";

        return (
            <div className={`app ${theme}`}>
                <Dashboard user={user} logout={logout} />
            </div>
        );
    }

    return (
        <div className="auth-page">
            {page === "login" ? (
                <Login
                    onLogin={handleLogin}
                    goToRegister={() => setPage("register")}
                />
            ) : (
                <Register
                    goToLogin={() => setPage("login")}
                />
            )}
        </div>
    );
}

export default App;
