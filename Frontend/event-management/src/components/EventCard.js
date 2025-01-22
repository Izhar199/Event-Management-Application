import React from 'react';
import './EventCard.scss';
function EventCard({ title, date, description, location }) {
    return (
        <div className="event-card">
            <h3>{title}</h3>
            <p>{date}</p>
            <p>{description}</p>
            <p>{location}</p>
        </div>
    );
}

export default EventCard;
