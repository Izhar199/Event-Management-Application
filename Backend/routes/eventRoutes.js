const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create an Event (Protected)
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, description, location, date } = req.body;
        const newEvent = new Event({
            title, description, location, date, createdBy: req.admin.id
        });
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
});

// Get All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
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

module.exports = router;
