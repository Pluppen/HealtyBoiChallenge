const express = require("express");
const pug = require("pug");

const router = express.Router();

const game = new (require("../game/game"))();
const Password = require("../game/password");

router.get("/", (req, res) => {
    res.render("index", {
        title: "HealtyBoiGame",
        message: "Hello there!",
        loggedInId: req.session.accountId,
        accounts: game.accounts,
    });
});

router.post("/", (req, res) => {
    const account = game.getAccountById(req.session.accountId);
    if (!account) {
        invalidAccountRender(res, req.session.accountId);
        return;
    }
    let modalInfo = null;
    let xpMultiplier = 1;
    if ("remove-xp" in req.body) {
        xpMultiplier = -1;
    }
    const amount = 10 * xpMultiplier;
    const leveledUp = account.addXp(amount);

    if (leveledUp) {
        modalInfo = {
            title: "You Leveled Up!",
            description: `You leveled up to level ${account.level}`,
            extraHtml: '<i class="nes-icon is-large star"></i>',
        };
    }

    res.render("index", {
        title: "HealtyBoiGame",
        message: "Hello there!",
        accounts: game.accounts,
        loggedInId: req.session.accountId,
        modalInfo,
    });
});

router.get("/account", (req, res) => {
    res.send(
        JSON.stringify(
            game.accounts.map((a) => {
                const obj = { ...a };
                obj.passwordHash = "";
                obj.passwordSalt = "";
                return obj;
            }),
        ),
    );
});

router.post("/account", (req, res) => {
    const username = req.body.username;
    if (game.getAccountByUsername(username)) {
        res.render("error", {
            message: `The user '${username}' already exists.`,
        });
        return;
    }
    const password = req.body.password;
    if (!password) {
        res.render("error", { message: "Invalid password." });
        return;
    }

    const account = game.createAccount(username, password);
    game.save();
    req.session.accountId = account.id;
    res.redirect("/");
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const account = game.getAccountByUsername(username);
    if (!account) {
        res.render("error", {
            message: `The username '${username}' doesn't exist, create an account first.`,
        });
        return;
    }
    const password = req.body.password;
    if (
        !Password.verify(password, account.passwordSalt, account.passwordHash)
    ) {
        res.render("error", {
            message: "Wrong password.",
        });
        return;
    }

    req.session.accountId = account.id;
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    delete req.session.accountId;
    res.redirect("/");
});

router.get("/shader", (req, res) => {
    const account = game.getAccountById(req.session.accountId);
    if (!account) {
        invalidAccountRender(res, req.session.accountId);
        return;
    }

    res.render("shader", { account: account });
});

router.post("/shader", (req, res) => {
    const account = game.getAccountById(req.session.accountId);
    if (!account) {
        invalidAccountRender(res, req.session.accountId);
        return;
    }
    account.vertexShaderCode = req.body.vertexShader;
    account.fragmentShaderCode = req.body.fragmentShader;

    account.useShaderForProfilePicture =
        req.body.useShaderForProfilePicture === "on";

    game.save();
    res.redirect("/");
});

function invalidAccountRender(res, id) {
    res.render("error", {
        message: `Couldn't find account with ID ${id}`,
    });
}

module.exports = router;
