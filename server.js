const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// to saving user credentials in th cookie
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');

const userRoutes = require('./routes/user');

const app = express();

dotenv.config();

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

// express routes middleware
app.use('/api', userRoutes);

const port = process.env.PORT || 7001;
app.listen(port, () => {
  console.log(`Online-Marketplace Server is running on port ${port}`);
});
