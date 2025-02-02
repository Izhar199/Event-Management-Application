import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Events.scss'; // Make sure this is imported
import Navbar from '../components/Navbar';
function Events() {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        description: '',
        location: ''
    });
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");

    // useEffect(() => {
    //     axios.get('http://localhost:5000/api/events', {
    //         params: { search, date, location }
    //     }) // Adjust URL to your backend
    //         .then(response => {
    //             setEvents(response.data);
    //         })
    //         .catch(error => console.error('Error fetching events:', error));
    // }, [search, date, location]);
    useEffect(() => {
        fetchEvents();
    }, []);
    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/events", {
                params: { search, date, location }
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token"); // Get token from storage
            // Send POST request to add the event
            const response = await axios.post('http://localhost:5000/api/events/add', newEvent, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                    "Content-Type": "application/json",
                },
            });

            // Update the events state to include the new event
            setEvents((prevEvents) => [...prevEvents, response.data]);
            console.log(response, 'eeeeeeeeee')
            // Reset the form and hide it
            setNewEvent({ title: '', date: '', description: '', location: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding new event:', error);
        }
    };

    return (
        <div className="App">
            <Navbar />
            <h1>Event Management</h1>

            {/* Button to open the form */}
            <button className="add-event" onClick={() => setShowForm(true)}>Add New Event</button>

            {/* Form to add a new event */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={newEvent.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={newEvent.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={newEvent.location}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">Submit Event</button>
                    <button type="button" className="cancel" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
            {/* Search & Filter Form */}
            {!showForm && <div className="search-form">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}

                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}

                />
                <input
                    type="text"
                    placeholder="Filter by location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={fetchEvents}>Search</button>
            </div>}

            {/* Display all events */}
            {!showForm && <div className="event-list">
                {events.map((event, index) => (
                    <EventCard
                        key={index}
                        title={event.title}
                        date={event.date}
                        description={event.description}
                        location={event.location}
                    />
                ))}
            </div>}
        </div>
    );
}

export default Events;
