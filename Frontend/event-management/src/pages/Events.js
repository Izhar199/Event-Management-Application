import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './Events.scss'; // Make sure this is imported
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import Favorites from './Favorite';
import BookedEvents from './BookedEvent';
import LiveChat from "../components/LiveChat";
function Events() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [bookedEvents, setBookedEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showFav, setShowFav] = useState(false);
    const [showBooked, setShowBooked] = useState(false);
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
        if (user?.role === 'user') {
            fetchFavorites();
            fetchBookedEvents();
        };
    }, [user?.role]);
    console.log(bookedEvents, 'bbbbbbbbbbbbb')
    const fetchEvents = async () => {
        try {
            console.log(search, date, location, 'ppppppppp')
            const response = await axios.get("http://localhost:5000/api/events", {
                params: { search, date, location }
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };
    const resetEvents = async () => {
        try {
            console.log(search, date, location, 'ppppppppp')
            const response = await axios.get("http://localhost:5000/api/events", {
                params: { search: '', date: '', location: '' }
            });
            setSearch('')
            setDate('')
            setLocation('')
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };
    const bookEvent = async (id) => {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:5000/api/events/${id}/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        alert(data.message);
        fetchBookedEvents()
        // setEvents(events.map(event => event._id === id ? { ...event, booked: true } : event));
    };
    const fetchBookedEvents = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/events/booked", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setBookedEvents(data); // ✅ Store in state
        } catch (error) {
            console.error("Error fetching booked events:", error);
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
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/events/${updatedEvent._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    const handleDelete = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setEvents(events.filter(event => event._id !== eventId));
                alert("Event deleted successfully!");
            } else {
                alert("Failed to delete the event.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div className="App">
            <LiveChat />
            <Navbar />
            <h1 className='header'>Event Management</h1>

            {/* Button to open the form */}
            {user?.role === 'admin' && <button className="add-event" onClick={() => setShowForm(true)}>Add New Event</button>}
            {user?.role === 'user' && <button className="add-event" onClick={() => {
                setShowFav(true);
                setShowBooked(false)
            }}>Favorite</button>}
            {user?.role === 'user' && <button className="add-event" onClick={() => {
                setShowFav(false)
                setShowBooked(true)
            }}>Booked Events</button>}
            {(showFav || showBooked) && <button className="add-event" onClick={() => {
                setShowBooked(false)
                setShowFav(false)
                fetchBookedEvents()
                fetchFavorites()
            }}>Show Events</button>}
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
                <button onClick={resetEvents}>Reset</button>
            </div>}

            {/* Display all events */}
            {!showForm && !showFav && !showBooked && <div className="event-list">
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
                        user={user}
                        onUpdate={updateEvent}
                        onDelete={handleDelete}
                        bookEvent={bookEvent}
                        bookedEvents={bookedEvents}

                    />
                ))}
            </div>}
            {showFav && !showBooked && <Favorites />}
            {showBooked && !showFav && <BookedEvents />}
        </div>
    );
}

export default Events;
