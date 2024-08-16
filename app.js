const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

// Set TEST_MODE = true to not have to login again after each code change while testing.
const TEST_MODE = false;

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "CHANGEME",
    }),
);

app.use((req, res, next) => {
    if (TEST_MODE) {
        req.session.accountId = 0;
    }

    if (
        req.session.accountId !== undefined ||
        req.url == "/account" ||
        req.url == "/login"
    ) {
        next();
    } else {
        res.render("login", { title: "Login" });
    }
});

app.use("/", routes);

module.exports = app;
