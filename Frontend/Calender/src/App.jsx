import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import CalendarComponent from "./components/CalenderComponent";
import AddAppointment from "./components/AddAppointment";
import Summary from "./components/Summary";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/calender" element={<CalendarComponent />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
