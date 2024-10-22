import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate=useNavigate()
  const handleLogout = () => {
    axios
      .get("http://localhost:5000/logout")
      .then((res) => {
        if (res.data === "success") navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <nav>
      <h1>Zendetta</h1>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/add-appointment'>Add Appointment</Link></li>
        <li><Link to='/summary'>Summary</Link></li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
