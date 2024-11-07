const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

// Function to create a Razorpay order
async function createOrder(receiptId) {
    const options = {
        amount: 10000, // Amount in paise (e.g., 10000 paise = ₹100)
        currency: 'INR',
        receipt: `receipt_order_${receiptId}`, // Use a unique identifier for the receipt
        payment_capture: 1 // Auto capture
    };

    try {
        const order = await razorpay.orders.create(options);
        return order; // Return the order object
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        // Log specific error details for debugging
        if (error.response) {
            console.error('Razorpay error response:', error.response);
        } else {
            console.error('General error:', error.message);
        }
        throw error; // Throw the error to be handled in the calling function
    }
}

// Route to create an order
router.post('/submit-event', async (req, res) => {
    const { name, contact, department, course, performanceType } = req.body;

    // Generate a unique receipt ID (you might use a database ID or a random string)
    const receiptId = Date.now().toString(); // Simple unique ID based on timestamp

    try {
        // Call createOrder function
        const order = await createOrder(receiptId);
        // Respond with order details
        res.json({
            order_id: order.id,
            amount: order.amount
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Payment verification route (optional, to verify payment success)
router.post('/verify-payment', (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Implement verification logic here (e.g., check Razorpay signature)
    // ...

    res.send('Payment verification route');
});

module.exports = { router, createOrder };
