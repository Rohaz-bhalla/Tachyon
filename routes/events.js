// event.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { createOrder } = require('./paymentRoutes'); // Import createOrder function from paymentRoutes.js

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

// Event-specific routes
router.get('/talent-hunt', (req, res) => res.render('talent_hunt'));
router.get('/engineer', (req, res) => res.render('engineer'));
router.get('/robo', (req, res) => res.render('robo'));
router.get('/smashers-league', (req, res) => res.render('smashers_league'));
router.get('/fashion-show', (req, res) => res.render('fashion_show'));

// Helper function for submitting event data and processing payment
async function handleEventSubmission(req, res, eventName) {
    const { name, contact, department, course, performanceType } = req.body;

    const sql = "INSERT INTO registrations (name, contact, department, course, event, extra_info) VALUES ?";
    const values = [[name, contact, department, course, eventName, performanceType]];

    // Insert the registration data into the MySQL database
    db.query(sql, [values], async (err, result) => {
        if (err) return res.status(500).send('Database error');

        try {
            // Use result.insertId as the receipt ID to create a unique Razorpay order
            const order = await createOrder(result.insertId);  
            
            // Send order details to the frontend (order_id and amount)
            res.json({ order_id: order.id, amount: order.amount });
        } catch (error) {
            res.status(500).send('Error creating Razorpay order');
        }
    });
}

// Event submission routes calling handleEventSubmission function
router.post('/submit-talent-hunt', (req, res) => handleEventSubmission(req, res, 'Talent Hunt'));
router.post('/submit-engineer', (req, res) => handleEventSubmission(req, res, 'I am Engineer'));
router.post('/submit-robo', (req, res) => handleEventSubmission(req, res, 'Robo War'));
router.post('/submit-smashers-league', (req, res) => handleEventSubmission(req, res, 'Smashers League'));
router.post('/submit-fashion-show', (req, res) => handleEventSubmission(req, res, 'Fashion Show'));

// Export the router
module.exports = router;
