const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Signup Admin
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Admin({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Login Admin
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        console.log(admin, 'ooooooooooooo')
        if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log(password, admin.password, 'jjjjjjjjjj')
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: admin._id, role: admin.role, name: admin.name, }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ id: admin._id, name: admin.name, role: admin.role, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
