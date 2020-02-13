const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// to saving user credentials in th cookie
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv').config();

const authUserRoutes = require('./routes/authUser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Connect to Atlas MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('Online Marketplace Atlas MongoDB Connected!'));

mongoose.connection.on('err', err => {
  console.log(
    `Online Marketplace Atlas MongoDB connection error: ${err.message} `
  );
});

// middlewares
// trace logs like this "GET /api/signup 404 0.602 ms - 149" in terminal
app.use(morgan('dev'));
// get json data from request body
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// express routes middleware
app.use('/api', authUserRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

const port = process.env.PORT || 7001;
app.listen(port, () => {
  console.log(`Online-Marketplace Server is running on port ${port}`);
});
