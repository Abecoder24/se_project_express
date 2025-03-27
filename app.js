const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require('celebrate')
const mainRouter = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;
const { requestLogger, errorLogger } = require('./middleware/logger');

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger); //req Logger
app.use('/', mainRouter);
app.use(errorLogger); //error logger
app.use(errors()); //celebrate error Handler

//centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})