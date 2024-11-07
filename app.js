const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const Razorpay = require('razorpay');
require('dotenv').config();


// Import route files
const rulesRoute = require('./routes/index');  // Main index routes (e.g., rules)
const eventRoutes = require('./routes/events'); // Event-specific routes
const paymentRoutes = require('./routes/paymentRoutes').router; // Payment-specific routes

// Create an Express app
const app = express();

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', rulesRoute);  // Index routes (e.g., rules)
app.use('/events', eventRoutes);  // Event routes
app.use('/payments', paymentRoutes); // Payment routes

// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
