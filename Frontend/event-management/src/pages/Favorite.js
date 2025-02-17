import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import EventCard from "../components/EventCard";
const Favorites = () => {
    const { admin } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    console.log(favorites, 'fff')
    useEffect(() => {
        fetchFavorites();
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
                            user={admin}
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
