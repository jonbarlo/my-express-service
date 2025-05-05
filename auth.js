const data = require('./data.js'); // Import the data module
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Typically a value between 10 and 12

bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
        // Handle error
        return;
    }
    console.log("Salt generated:", salt); // Log the generated salt
    // You can now use the salt to hash passwords
// Salt generation successful, proceed to hash the password
});

// Function to verify user credentials
function authenticateUser(username, password) {
    const user = data.users.find((user) => user.username === username);
    if (!user) {
        return null; // User not found
    }
    if (bcrypt.compareSync(password, user.password)) {
        return user; // Password is correct
    }
    return null; // Password is incorrect
}
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authentication token missing' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
        return res.status(403).json({ error: 'Token is invalid'});
        }
        req.user = user;
        next(); // Continue to the protected route
    });
}
module.exports = {
    authenticateUser,
    authenticateToken
};