import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import EventCard from "../components/EventCard";
const Favorites = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [bookedEvents, setBookedEvents] = useState([]);
    console.log(favorites, 'fff')
    useEffect(() => {
        fetchFavorites();
        fetchBookedEvents();
    }, []);

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
    return (
        <div>
            <h2>My Favorite Events</h2>
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((event, index) => (
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
                            bookEvent={bookEvent}
                            bookedEvents={bookedEvents}
                        />
                    ))
                ) : (
                    <p>No favorite events yet.</p>
                )}
            </ul>
        </div>
    );
};

export default Favorites;
