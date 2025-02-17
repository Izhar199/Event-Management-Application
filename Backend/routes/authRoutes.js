const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Signup Admin
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin exists
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ error: 'Admin already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new Admin({ username, password: hashedPassword });

        // Save to DB
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ id: admin._id, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
