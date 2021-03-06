const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Express App Initialization
const app = express();

// Use Body Parser Middleware
app.use(bodyParser.json());

// MongoDb Connection
const db = require('./configs/db').dbConfig;

mongoose.Promise = global.Promise;
mongoose.connect(db.url, db.settings);
mongoose.connection
    .once('open', () => console.log('Connected to Mongo'))
    .on('error', err => console.log('Mongo Connection Error: ', err));

// API Routes
app.use('/api/v.1/diners', require('./routes/api/diners'));
app.use('/api/v.1/tables', require('./routes/api/tables'));
app.use('/api/v.1/reservations', require('./routes/api/reservations'));

// Port Listener
const port = 4000 || process.env.PORT;

app.listen(port, () => console.log(
    `Connected to the server and now listening at port ${port}`
));
