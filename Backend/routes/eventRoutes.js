const express = require('express');
const Event = require('../models/Event');
const Admin = require('../models/Admin');
const Booking = require("../models/Bookings");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Create an Event (Protected)
router.post("/add", async (req, res) => {
    try {
        const { title, date, description, location } = req.body;
        const newEvent = new Event({ title, date, description, location });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Events
router.get('/', async (req, res) => {
    try {
        const { search, date, location } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (date) {
            query.date = date;
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const events = await Event.find(query);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});
// ✅ Cancel booking route
router.delete("/:id/cancel", authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get logged-in user ID
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        // ✅ Check if user has booked the event
        if (!event.bookings.includes(userId)) {
            return res.status(400).json({ message: "You have not booked this event" });
        }

        // ✅ Remove user ID from bookings array
        event.bookings = event.bookings.filter(id => id.toString() !== userId);
        await event.save();

        res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
        console.error("❌ Error canceling booking:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
//  Book an event
router.post("/:id/book", authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        // ✅ Ensure req.user is correctly populated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (event.bookings.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already booked this event" });
        }

        event.bookings.push(req.user.id);
        await event.save();
        res.status(200).json({ message: "Event booked successfully!" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

//  Get events with booking details
router.get("/booked", authenticate, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const userId = req.user.id; // ✅ Get user ID from token
        console.log("🔹 Fetching booked events for user:", userId);

        const bookedEvents = await Event.find({ bookings: userId });

        res.status(200).json(bookedEvents);
    } catch (error) {
        console.error("❌ Error fetching booked events:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get Single Event
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching event' });
    }
});

// Update an Event (Protected)
router.put('/:id', async (req, res) => {
    try {
        const { title, description, location, date } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, { title, description, location, date }, { new: true }
        );
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Error updating event' });
    }
});

// Delete an Event (Protected)
router.delete("/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Toggle favorite event
router.post("/favorite/:eventId", async (req, res) => {
    try {
        const { userId } = req.body; // Assume user ID is sent in the request body
        const { eventId } = req.params;

        const user = await Admin.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if event is already favorited
        if (user.favorites.includes(eventId)) {
            user.favorites = user.favorites.filter(id => id.toString() !== eventId);
        } else {
            user.favorites.push(eventId);
        }

        await user.save();
        res.json({ message: "Favorite status updated", favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: "Error updating favorites", error });
    }
});


// Get user's favorite events
router.get("/:userId/favorites", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await Admin.findById(userId).populate("favorites"); // Populate event details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.favorites); // Send favorite events
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites", error });
    }
});

router.put("/:id", authenticate, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        console.log(updatedEvent)
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error });
    }
});

module.exports = router;
