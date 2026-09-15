import { useState } from "react";
import API from "./api";

function Login({ onLogin, goToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginUser = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/login", {
                email,
                password,
            });

            onLogin(response.data.user);
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Unable to connect to the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-card" onSubmit={loginUser}>
            <div className="diary-icon">📔</div>

            <h1>Welcome Back</h1>
            <p className="subtitle">Your memories are waiting for you ✨</p>

            <label>Email</label>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>

            <p className="switch-text">
                Don't have an account?
                <span onClick={goToRegister}> Create Account</span>
            </p>
        </form>
    );
}

export default Login;
