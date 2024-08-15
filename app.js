const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "CHANGEME",
  }),
);
app.use("/", routes);

module.exports = app;
