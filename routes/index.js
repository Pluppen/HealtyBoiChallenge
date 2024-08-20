const express = require("express");
const path = require("path");

const router = express.Router();

const game = new (require("../game/game"))();
const Password = require("../game/password");

const { generateToken } = require("../utils/jwtUtils");

router.post("/", (req, res) => {
    let modalInfo = null;
    const account = game.getAccountById(req.user.id);
    if (!account) {
        res.status(401).json({
            success: false,
            message: "Could not find any account tied to your token",
        });
        return;
    }

    let target = null;
    switch (req.body.action) {
        case "attack":
            target = game.getAccountById(req.body.id);
            target.damage();
            break;
        case "heal":
            target = game.getAccountById(req.body.id);
            target.heal();
            break;
        default:
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
    }

    res.json({
        success: true,
        accounts: game.accounts.map((a) => ({
            ...a,
            passwordHash: "",
            passwordSalt: "",
        })),
        modalInfo,
    });
});

router.get("/account", (req, res) => {
    res.json(
        game.accounts.map((a) => {
            const obj = { ...a };
            obj.passwordHash = "";
            obj.passwordSalt = "";
            return obj;
        }),
    );
});

router.post("/account", (req, res) => {
    const username = req.body.username;
    if (game.getAccountByUsername(username)) {
        res.status(401).json({
            success: false,
            message: `The user '${username}' already exists.`,
        });
        return;
    }
    const password = req.body.password;
    if (!password) {
        res.status(403).json({
            success: false,
            message: "Invalid password",
        });
        return;
    }

    game.createAccount(username, password);
    game.save();
    res.json({ success: true, message: "Account created successfully" });
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const account = game.getAccountByUsername(username);
    if (!account) {
        res.status(401).json({
            success: false,
            message: `The username '${username}' doesn't exist, create an account first.`,
        });
        return;
    }

    const password = req.body.password;
    if (
        !Password.verify(password, account.passwordSalt, account.passwordHash)
    ) {
        res.status(401).json({
            success: false,
            message: "Wrong password.",
        });
        return;
    }

    const token = generateToken({
        ...account,
        passwordHash: "you wish",
        passwordSalt: "you wish",
    });
    res.json({
        success: true,
        message: "Authentication successful!",
        token,
        user: account,
    });
});

router.get("/logout", (req, res) => {
    delete req.session.accountId;
    delete req.user;
    // TODO: Also do some invalidation of token.
    res.redirect("/");
});

router.post("/shader", (req, res) => {
    const account = game.getAccountById(req.user.id);
    if (!account) {
        res.status(401).json({
            success: false,
            message: "Could not find any account tied to your token",
        });
        return;
    }

    account.vertexShaderCode = req.body.vertexShaderCode;
    account.fragmentShaderCode = req.body.fragmentShaderCode;
    account.useShaderForProfilePicture = req.body.useShaderForProfilePicture;

    game.save();
    res.json({
        success: true,
        message: "Updated shader profile",
        account: { ...account, passwordHash: "", passwordSalt: "" },
    });
});

// Render React App if no direct match on path
router.get("/", (req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

module.exports = router;
