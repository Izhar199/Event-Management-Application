import React, { useState } from 'react';
import './EventCard.scss';
import CommentSection from "../pages/CommentSection";
function EventCard({ title, date, description, location, toggleFavorite, favorites, event, user, onUpdate, onDelete, bookEvent = null, bookedEvents = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    // Convert date to YYYY-MM-DD format (needed for input[type="date"])
    const formattedDate = event.date ? new Date(event.date).toISOString().split("T")[0] : "";
    const [updatedEvent, setUpdatedEvent] = useState({ ...event, date: formattedDate });

    const handleChange = (e) => {
        setUpdatedEvent({ ...updatedEvent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdate(updatedEvent);
        setIsEditing(false);
    };

    console.log(bookedEvents, date, 'kkkkkk')
    return (
        <div className="event-card" key={event._id}>
            {!isEditing ? (<><h3>{title}</h3>
                <p>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))}</p>
                <p>{description}</p>
                <p>{location}</p>

                <div className='book-favorite-buttons'>
                    {user?.role === 'user' && (bookedEvents.length > 0 &&
                        bookedEvents?.some(eventObj => eventObj._id === event._id) ? (
                        <button className="booked" disabled>
                            Booked
                        </button>
                    ) : (
                        <button
                            onClick={() => bookEvent(event._id)}
                            className="book-button"
                        >
                            Book Now
                        </button>
                    )
                    )}
                    {user?.role === 'user' && (
                        <button className='button favorite-btn' onClick={() => toggleFavorite(event._id)}>
                            {favorites.some(eventObj => {
                                return eventObj._id === event._id
                            }) ? "⭐ Unfavorite" : "☆ Favorite"}
                        </button>

                    )}
                    {user?.role === 'admin' && (
                        <button className='button' onClick={() => setIsEditing(true)}>✏️ Edit</button>
                    )
                    }
                    {user?.role === 'admin' && (
                        <button onClick={() => onDelete(event._id)} className="delete-btn">🗑️ Delete</button>
                    )
                    }
                </div>
                <CommentSection eventId={event._id} user={user} />
            </>) : (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setIsEditing(false)}>✖</button>
                        <form className="edit-form" onSubmit={handleSubmit}>
                            <input name="title" value={updatedEvent.title} onChange={handleChange} placeholder="Event Title" />
                            <input name="date" type="date" value={updatedEvent.date} onChange={handleChange} />
                            <input name="description" value={updatedEvent.description} onChange={handleChange} placeholder="Event Description" />
                            <input name="location" value={updatedEvent.location} onChange={handleChange} placeholder="Location" />

                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default EventCard;
