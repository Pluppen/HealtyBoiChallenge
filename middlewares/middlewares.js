module.exports = {
    testMode: function (req, res, next) {
        req.session.accountId = 0;
        next();
    },
    requireLoggedIn: function (req, res, next) {
        if (
            req.session.accountId !== undefined ||
            req.url == "/account" ||
            req.url == "/login"
        ) {
            next();
        } else {
            res.render("login", { title: "Login" });
        }
    },
};
