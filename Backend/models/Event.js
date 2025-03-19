const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store booked users
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            name: String,
            text: String,
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Event', EventSchema);
