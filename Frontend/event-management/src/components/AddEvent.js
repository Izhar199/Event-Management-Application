import React, { useState } from 'react';
import axios from 'axios';

function AddEvent() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/events', { title, date, description });
            alert('Event added successfully!');
            setTitle('');
            setDate('');
            setDescription('');
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Event</h2>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Event</button>
        </form>
    );
}

export default AddEvent;
