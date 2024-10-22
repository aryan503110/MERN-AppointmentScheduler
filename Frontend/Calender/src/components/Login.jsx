import React, { useState } from "react";
import axios from "axios";
import './Login.css'
import { useNavigate } from "react-router-dom";

function Login({setRole}) {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const Res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (Res.data.success) {
        navigate("/calender");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div  className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>Email :</label>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setemail(e.target.value)}
        ></input>
        <label>Password :</label>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setpassword(e.target.value)}
        ></input>
        <button>Login</button>
        <p className="register-link">
          Not registered? <a href="/">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
