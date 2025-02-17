import React, { useEffect, useState } from 'react';
import './EventCard.scss';
function EventCard({ title, date, description, location, toggleFavorite, favorites, event, user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedEvent, setUpdatedEvent] = useState({ ...event });

    const handleChange = (e) => {
        setUpdatedEvent({ ...updatedEvent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(updatedEvent);
        setIsEditing(false);
    };



    return (
        <div className="event-card" key={event._id}>
            {!isEditing ? (<><h3>{title}</h3>
                <p>{date}</p>
                <p>{description}</p>
                <p>{location}</p>
                <div className='buttons'>
                    {user && (
                        <button className='button favorite-btn' onClick={() => toggleFavorite(event._id)}>
                            {favorites.some(eventObj => {
                                return eventObj._id === event._id
                            }) ? "⭐ Unfavorite" : "☆ Favorite"}
                        </button>

                    )}
                    {user && (
                        <button className='button' onClick={() => setIsEditing(true)}>Edit</button>
                    )
                    }
                </div>
            </>) : (
                <form onSubmit={handleSubmit}>
                    <input name="title" value={updatedEvent.title} onChange={handleChange} />
                    <input name="date" value={updatedEvent.date} onChange={handleChange} />
                    <input name="description" value={updatedEvent.description} onChange={handleChange} />
                    <input name="location" value={updatedEvent.location} onChange={handleChange} />
                    <button type="submit">Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )
            }
        </div>
    )
}

export default EventCard;
