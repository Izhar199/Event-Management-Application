import React, { useEffect, useState, useContext } from "react";
import EventCard from "../components/EventCard";
import { AuthContext } from '../context/AuthContext';
import './BookedEvents.scss';
const BookedEvents = () => {
    const { user } = useContext(AuthContext);
    const [bookedEvents, setBookedEvents] = useState([]);
    const token = localStorage.getItem("token"); // ✅ Get token from storage
    const fetchBookedEvents = async () => {
        try {
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
    useEffect(() => {


        fetchBookedEvents();
    }, []);
    // ✅ Function to cancel booking
    const cancelBooking = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/cancel`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                alert("Booking canceled successfully!");
                fetchBookedEvents(); // ✅ Refresh booked events after canceling
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("❌ Error canceling booking:", error);
        }
    };
    return (
        <div>
            <h2 className="booked-evnts">My Booked Events</h2>
            {bookedEvents.length === 0 ? (
                <p>No events booked yet.</p>
            ) : (
                <ul>
                    {bookedEvents?.map((event, index) => (
                        <>
                            <div className="event-card" key={event._id}>
                                <h3>{event.title}</h3>
                                <p>{event.date}</p>
                                <p>{event.description}</p>
                                <p>{event.location}</p>
                                <div className='buttons'>
                                    {user?.role === 'user' &&

                                        <button className="cancel-button" onClick={() => cancelBooking(event._id)} >
                                            Cancel Booking
                                        </button>}
                                </div>
                            </div>
                        </>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookedEvents;
