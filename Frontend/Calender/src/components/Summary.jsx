import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Summary.css'
import { Link } from 'react-router-dom';

function Summary() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const response = await axios.get('http://localhost:5000/appointments');
            setAppointments(response.data);
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <center><h2>Upcoming Appointments</h2></center>
            <ul className='unordered-list'>
                {appointments.map(e => (
                    <li key={e._id} className='list'>
                        {e.title} - {new Date(e.startTime).toLocaleString()} to {new Date(e.endTime).toLocaleString()}
                    </li>
                ))}
            </ul>
            <center><Link to='/calender'>Return to Home</Link></center>
        </div>
    );
}

export default Summary;
