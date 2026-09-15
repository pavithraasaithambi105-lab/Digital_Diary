import { useState } from "react";
import API from "./api";

function Register({ goToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);

    const registerUser = async (event) => {
        event.preventDefault();

        if (!name || !email || !password || !gender) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/register", {
                name,
                email,
                password,
                gender,
            });

            alert(response.data.message);
            goToLogin();
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
        <form className="auth-card" onSubmit={registerUser}>
            <div className="diary-icon">📔</div>

            <h1>Create Your Diary</h1>
            <p className="subtitle">Start recording your memories ✨</p>

            <label>Name</label>
            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>
            <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label>Gender</label>
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>

            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="switch-text">
                Already have an account?
                <span onClick={goToLogin}> Login</span>
            </p>
        </form>
    );
}

export default Register;
