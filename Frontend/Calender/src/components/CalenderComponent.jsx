import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Import Drag and Drop components
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Navbar from './Navbar';

const localizer = momentLocalizer(moment);

// Enable drag-and-drop using the HOC
const DragAndDropCalendar = withDragAndDrop(Calendar);

function CalendarComponent() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch appointments
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/appointments');
                const formattedEvents = response.data.map(event => ({
                    id: event._id,
                    title: event.title,
                    start: new Date(event.startTime),
                    end: new Date(event.endTime)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, []);

    // Handle event drop (drag and drop)
    const handleEventDrop = async ({ event, start, end }) => {
        const updatedEvent = { ...event, startTime: start, endTime: end };

        try {
            // Update appointment in DB
            await axios.put(`http://localhost:5000/appointments/${event.id}`, updatedEvent);

            // Update state
            setEvents(events.map(e => (e.id === event.id ? { ...e, start, end } : e)));
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    // Handle event resize
    const handleEventResize = async ({ event, start, end }) => {
        const updatedEvent = { ...event, startTime: start, endTime: end };

        try {
            // Update appointment in DB
            await axios.put(`http://localhost:5000/appointments/${event.id}`, updatedEvent);

            // Update state
            setEvents(events.map(e => (e.id === event.id ? { ...e, start, end } : e)));
        } catch (error) {
            console.error('Error resizing appointment:', error);
        }
    };

    // Event deletion (optional functionality)
    const handleEventDelete = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/appointments/${eventId}`);
            setEvents(events.filter(e => e.id !== eventId));
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <>
        <Navbar/>
        <DndProvider backend={HTML5Backend}>
            <DragAndDropCalendar
                localizer={localizer}
                events={events}
                defaultView="week"
                style={{ height: '80vh' }}
                onEventDrop={handleEventDrop}   // Drag-and-drop handler
                onEventResize={handleEventResize} // Resizing handler
                resizable   // Enable resizing
                selectable  // Allow selecting time slots
                draggableAccessor={() => true}  // Make all events draggable
                onDoubleClickEvent={(event) => handleEventDelete(event.id)}  // Optional: Double-click to delete event
            />
        </DndProvider>
        </>
    );
}

export default CalendarComponent;
