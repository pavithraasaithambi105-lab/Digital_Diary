import { useState } from "react";

function Register({ goToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);

    const registerUser = (event) => {
        event.preventDefault();

        if (!name || !email || !password || !gender) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        // Get existing users
        const existingUsers =
            JSON.parse(localStorage.getItem("users")) || [];

        // Check whether email already exists
        const emailExists = existingUsers.some(
            (user) =>
                user.email.toLowerCase() ===
                email.trim().toLowerCase()
        );

        if (emailExists) {
            alert("Email already registered. Please login.");
            setLoading(false);
            return;
        }

        // Create new account
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            gender: gender,
        };

        // Save account in browser
        localStorage.setItem(
            "users",
            JSON.stringify([
                ...existingUsers,
                newUser,
            ])
        );

        alert("Registration successful!");

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setGender("");

        setLoading(false);

        // Go to Login
        goToLogin();
    };

    return (
        <form className="auth-card" onSubmit={registerUser}>

            <div className="diary-icon">📔</div>

            <h1>Create Your Diary</h1>

            <p className="subtitle">
                Start recording your memories ✨
            </p>

            <label>Name</label>

            <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <label>Email</label>

            <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <label>Password</label>

            <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <label>Gender</label>

            <select
                value={gender}
                onChange={(e) =>
                    setGender(e.target.value)
                }
            >
                <option value="">
                    Select Gender
                </option>

                <option value="male">
                    Male
                </option>

                <option value="female">
                    Female
                </option>
            </select>

            <button type="submit" disabled={loading}>
                {loading
                    ? "Creating..."
                    : "Create Account"}
            </button>

            <p className="switch-text">
                Already have an account?

                <span onClick={goToLogin}>
                    {" "}Login
                </span>
            </p>

        </form>
    );
}

export default Register;