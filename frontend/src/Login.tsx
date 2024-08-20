import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import {useAuth} from "./App";

const Login: React.FC = () => {
  let auth = useAuth();
  const navigate = useNavigate();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let [regUsername, setRegUsername] = useState("");
  let [regPassword, setRegPassword] = useState("");

  let login = (user: string, pass: string) => {
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user, password: pass }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.log("ERROR");
          console.log(data);
          // TODO: Add user feedback here.
        } else {
          auth.signin(data, () => {
            console.log("Successfully signed in");
          });
          navigate("/");
        }
      });
  };

  let handleLoginEvent = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  let handleRegistrationEvent = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:3000/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: regUsername, password: regPassword }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          login(regUsername, regPassword);
        } else {
          // Send error back to user.
          // TODO: Add user feedback here.
        }
      });
  };

  return (
    <div className="auth-container">
      <form
        action="/login"
        method="POST"
        className="nes-container is-dark is-rounded with-title"
        onSubmit={handleLoginEvent}
      >
        <p className="title"> Login</p>
        <div className="nes-field">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            id="username"
            className="nes-input is-dark"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="nes-field">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            className="nes-input is-dark"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="nes-btn" style={{ marginTop: "20px" }}>
          Login
        </button>
      </form>

      <form
        action="/account"
        method="POST"
        className="nes-container is-dark is-rounded with-title"
        onSubmit={handleRegistrationEvent}
      >
        <p className="title"> Create account</p>
        <div className="nes-field">
          <label htmlFor="username_2">Username</label>
          <input
            name="username"
            id="username_2"
            className="nes-input is-dark"
            onChange={(e) => setRegUsername(e.target.value)}
            value={regUsername}
          />
        </div>
        <div className="nes-field">
          <label htmlFor="password_2">Password</label>
          <input
            id="password_2"
            name="password"
            type="password"
            className="nes-input is-dark"
            onChange={(e) => setRegPassword(e.target.value)}
            value={regPassword}
          />
        </div>
        <button className="nes-btn" style={{ marginTop: "20px" }}>
          Create account
        </button>
      </form>
    </div>
  );
};

export default Login;
