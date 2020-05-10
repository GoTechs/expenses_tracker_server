require("./models/Expense");
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expensesRoutes = require("./routes/expensesRoutes");

const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI || "mongodb+srv://slimane31:Realmadrid31@node-training-37cx9.mongodb.net/test?retryWrites=true&w=majority";
if (!mongoUri) {
  throw new Error(`MongoURI was not supplied.`);
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", expensesRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`listening on ${ process.env.PORT || 8080}`);
    app.listen(8080);
  })
  .catch((err) => console.log(err));
