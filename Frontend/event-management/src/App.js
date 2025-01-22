import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './components/EventCard';
import './App.scss'; // Make sure this is imported

function App() {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        description: '',
        location: ''
    });
    useEffect(() => {
        axios.get('http://localhost:5000/api/events') // Adjust URL to your backend
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }, []);

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
            // Send POST request to add the event
            const response = await axios.post('http://localhost:5000/api/events', newEvent);

            // Update the events state to include the new event
            setEvents((prevEvents) => [...prevEvents, response.data]);

            // Reset the form and hide it
            setNewEvent({ title: '', date: '', description: '', location: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding new event:', error);
        }
    };

    return (
        <div className="App">
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

export default App;
