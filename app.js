const http = require('http');
const path = require('path');

// Third party dependencies
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Midddlewares
app.use(morgan('tiny')); // Logger
app.use(helmet()); // Minimal security
app.use(cors()); // Cross-Origin protection
app.use(express.json()); // Json body parser
app.use(express.static(path.join(__dirname, './public'))); 

// Routes

app.get('/url/:id', (req, res) => {
    // TODO: get a short url by id and get information about your short url
});

app.get('/:id', (req, res) => {
    // TODO: redirect to url
});

app.post('/url', (req, res) => {
    // TODO: create a short url
});




const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`App.js server running on ${PORT}`));