import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Events.scss'; // Make sure this is imported
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import Favorites from './Favorite';
function Events() {
    const { admin } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showFav, setShowFav] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        description: '',
        location: ''
    });
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        fetchEvents();
        if (admin) fetchFavorites();
    }, [admin]);
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
    const fetchFavorites = async () => {
        try {
            const id = localStorage.getItem('id');
            const response = await axios.get(`http://localhost:5000/api/events/${id}/favorites`);
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorites", error);
        }
    };
    const toggleFavorite = async (eventId) => {
        try {

            const id = localStorage.getItem('id');
            await axios.post(`http://localhost:5000/api/events/favorite/${eventId}`, { userId: id });

            fetchFavorites(); // Refresh favorites
        } catch (error) {
            console.error("Error toggling favorite", error);
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

            // Reset the form and hide it
            setNewEvent({ title: '', date: '', description: '', location: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding new event:', error);
        }
    };
    const updateEvent = async (updatedEvent) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${updatedEvent._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) throw new Error("Failed to update event");

            const updatedData = await response.json();

            // Update the event list in state
            setEvents(events.map((ev) => (ev._id === updatedEvent._id ? updatedData : ev)));
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    return (
        <div className="App">
            <Navbar />
            <h1 className='header'>Event Management</h1>

            {/* Button to open the form */}
            <button className="add-event" onClick={() => setShowForm(true)}>Add New Event</button>
            <button className="add-event" onClick={() => setShowFav(true)}>Favorite</button>
            {showFav && <button className="add-event" onClick={() => setShowFav(false)}>Show Events</button>}
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
            {!showForm && !showFav && <div className="event-list">
                {events.map((event, index) => (
                    <EventCard
                        key={index}
                        title={event.title}
                        date={event.date}
                        description={event.description}
                        location={event.location}
                        toggleFavorite={toggleFavorite}
                        favorites={favorites}
                        event={event}
                        user={admin}
                        onUpdate={updateEvent}
                    />
                ))}
            </div>}
            {showFav && <Favorites />}
        </div>
    );
}

export default Events;
