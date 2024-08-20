// @ts-check

const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const middlewares = require("./middlewares/middlewares");
const cors = require("cors");

const app = express();

// Set TEST_MODE = true to not have to login again after each code change while testing.
const TEST_MODE = false;

app.use(express.static(path.join(__dirname, './frontend/build')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "CHANGEME",
    }),
);

app.use(cors());

if (TEST_MODE) {
    app.use(middlewares.testMode);
} else {
    app.use(middlewares.requireLoggedIn);
}

app.use("/", routes);

module.exports = app;
