const express = require('express');
const Event = require('../models/Event');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create an Event (Protected)
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description, location, date } = req.body;
        const newEvent = new Event({
            title, description, location, date, createdBy: req.admin.id
        });
        console.log(newEvent)
        await newEvent.save();
        res.json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
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


// Get Single Event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching event' });
    }
});

// Update an Event (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting event' });
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
        console.log(userId)
        const user = await Admin.findById(userId).populate("favorites"); // Populate event details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.favorites); // Send favorite events
    } catch (error) {
        res.status(500).json({ message: "Error fetching favorites", error });
    }
});



module.exports = router;
