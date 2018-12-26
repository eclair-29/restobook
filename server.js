const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Express App Initialization
const app = express();

// Use Body Parser Middleware
app.use(bodyParser.json());

// MongoDb Connection

// API Routes
app.get('/', (req, res) => {
    const message = 'Testing API Router...';
    console.log(message);
    res.json({ message });
})

// Port Listener
const port = 4000 || process.env.PORT;
app.listen(port, () => console.log(
    `Connected to the server and now listening at port ${port}`
));
