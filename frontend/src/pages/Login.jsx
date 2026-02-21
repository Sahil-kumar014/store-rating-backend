import { useState } from "react";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const data = await api("/api/auth/Login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });

      localStorage.setItem("token", data.token);
      if (data.role) localStorage.setItem("role", data.role);

      setMsg("Login successful");
      window.location.href = "/stores";
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button style={{ width: "100%", padding: 10 }}>Login</button>
      </form>
      <p style={{ marginTop: 10, color: msg.includes("done!") ? "green" : "red" }}>
        {msg}
      </p>
      <p>
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}