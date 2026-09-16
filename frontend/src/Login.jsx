import { useState } from "react";

function Login({ onLogin, goToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginUser = (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        setLoading(true);

        // Get registered users
        const existingUsers =
            JSON.parse(localStorage.getItem("users")) || [];

        // Find matching account
        const user = existingUsers.find(
            (user) =>
                user.email.toLowerCase() ===
                    email.trim().toLowerCase() &&
                user.password === password
        );

        if (!user) {
            alert("Invalid email or password");
            setLoading(false);
            return;
        }

        // Save logged-in user
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        alert("Login successful!");

        setLoading(false);

        // Send user to App
        onLogin(user);
    };

    return (
        <form className="auth-card" onSubmit={loginUser}>

            <div className="diary-icon">📔</div>

            <h1>Welcome Back</h1>

            <p className="subtitle">
                Your memories are waiting for you ✨
            </p>

            <label>Email</label>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <label>Password</label>

            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Logging in..."
                    : "Login"}
            </button>

            <p className="switch-text">
                Don't have an account?

                <span onClick={goToRegister}>
                    {" "}Create Account
                </span>
            </p>

        </form>
    );
}

export default Login;