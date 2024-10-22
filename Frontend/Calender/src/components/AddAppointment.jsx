import React, { useState } from "react";
import axios from "axios";
import "./AddAppointment.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AddAppointment() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAppointment = {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };

    await axios.post("http://localhost:5000/appointments", newAppointment);

    setTitle("");
    setStartTime("");
    setEndTime("");

    navigate("/calender");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter appointment title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="startTime">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            className="form-input"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="endTime">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            className="form-input"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Appointment
        </button>
        <div className="link">
          <Link to="/calender">Return to Home</Link>
        </div>
      </form>
    </div>
  );
}

export default AddAppointment;
