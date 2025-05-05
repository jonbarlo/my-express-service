const express = require('express');
const data = require('./data.js'); // Import the data module
const auth = require('./auth.js'); // Import the authentication module
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3031; // Use the port provided by the host or default to 3000

require('dotenv').config({ path: './.env' })

console.log("PORT:", process.env.PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("DATABASE_PASSWORD:", process.env.DATABASE_PASSWORD);
console.log("EMAIL_ID:", process.env.EMAIL_ID);
console.log("STRIPE_API_KEY:", process.env.STRIPE_API_KEY);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Define a route to handle incoming requests
app.get('/', (req, res) => {
  value = data.items; // Access the data from the imported module
  console.log(value); // Log the data to the console
  res.send('Server is up!'); // Send a response to the client
  //res.send('DATA', data.items); // Send a response to the client
});

// Create (POST) a new item
app.post('/items', (req, res) => {
  const newItem = req.body;
  data.items.push(newItem);
  res.status(201).json(newItem);
});

// Read (GET) all items
app.get('/items', (req, res) => {
  res.json(data.items);
});

// Read (GET) a specific item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = data.items.find((item) => item.id === id);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

// Reads (GET) a hashed password for testing purposes
// This is not a secure practice and should not be used in production
app.post('/hash', async (req, res) => {
  const userPassword = req.body.password;
  console.log('req.body :', req.body);
  console.log('userPassword :', userPassword);
  console.log('API_SALT :', process.env.API_SALT);
  salt = await bcrypt.genSalt();
  console.log('bcrypt.genSalt :', process.env.API_SALT);
  hashedPassword = await bcrypt.hash(userPassword, salt);
  console.log('Hashed password:', hashedPassword);
  res.json(hashedPassword);
});

// Update (PUT) an item by ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.findIndex((item) => item.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    data[index] = { ...data[index], ...updatedItem };
    res.json(data[index]);
  }
});

// Delete (DELETE) an item by ID
app.delete('/items/:id', (req, res) => {
      const id = parseInt(req.params.id);
      const index = data.findIndex((item) => item.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        const deletedItem = data.splice(index, 1);
        res.json(deletedItem[0]);
      }
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = auth.authenticateUser(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  secretKey = process.env.JWT_SECRET_KEY; // Secret key for JWT signing
  console.log('secretKey:', secretKey);

  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, {
        expiresIn: '1h', // Token expiration time
  });

  res.json({ token });
});

// Example usage:
app.get('/protected', auth.authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});