const express = require('express');
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
    res.render('index');  // Render the landing page
});

// Home page
router.get('/home', (req, res) => {
    res.render('home');  // Render the homepage with carousel and navigation
});

//Rules
router.get('/rules', (req, res) => {
    res.render('rules'); // This will render rules.ejs from the views folder
});

module.exports = router;
