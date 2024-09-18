const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv/config");
const morgan = require("morgan");
const api = process.env.API_URL;
const productRouter = require("./routers/products");
const categoryRouter = require("./routers/categories");
const userRouter = require("./routers/users");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.options("*", cors());

// Middlewares
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter)
app.use(`${api}/users`, userRouter);


// Connect to db
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("DB is connectedd"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Server is runnin on port 3000");
});
