const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the request header
    const token = req.header('Authorization');

    // 2. Check if the token exists
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Add the user ID to the request so the next function knows who is logged in
        req.user = decoded.userId;
        
        // 5. Move to the next step (the actual Task logic)
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};