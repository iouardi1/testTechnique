const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morganMiddleware = require('./middlewares/logger');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const port = 3002;

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(morganMiddleware);
app.get('/health', (req, res) => res.send({ message: 'ok' }));

// Use user routes
app.use('/api/users', userRoutes);

const server = app.listen(port, () => {
  console.log(`Datatys App running on port ${port}.`);
});
module.exports = server;
