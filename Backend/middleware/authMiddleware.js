const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "your_secret_key");

        console.log("Decoded Token:", decoded); // 🔍 Debug log

        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token: User ID missing" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Auth Error:", err);
        res.status(400).json({ message: "Invalid token" });
    }
};

// **✅ Authorize Admin Only**
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access Denied. Admins only." });
    next();
};

module.exports = { authenticate, authorizeAdmin };
