const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user');

const app = express();

dotenv.config();

// express routes middleware
app.use('/api', userRoutes);

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

const port = process.env.PORT || 7001;
app.listen(port, () => {
  console.log(`Online-Marketplace Server is running on port ${port}`);
});
