import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import WorkzenLogo from "../components/WorkzenLogo";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);

    if (!success) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="app-title">
        <WorkzenLogo size={40} textSize={32} />
      </div>

      <div className="login-box">
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to manage your team&rsquo;s work</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}