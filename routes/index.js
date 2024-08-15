const express = require("express");
const pug = require("pug");

const router = express.Router();

const accounts = [];
const players = [];
router.get("/", (req, res) => {
  if (req.session.account) {
    res.render("index", {
      title: "HealtyBoiGame",
      message: "Hello there!",
      players: players,
    });
  } else {
    res.render("login", { title: "Login" });
  }
});

router.post("/", (req, res) => {
  console.log(req.body);

  const player = players.find((player) => player.id == req.body.id);
  player.xp += 10;

  if (req.session.account) {
    res.render("index", {
      title: "HealtyBoiGame",
      message: "Hello there!",
      players: players,
    });
  } else {
    res.render("login", { title: "Login" });
  }
});

router.post("/account", (req, res) => {
  const username = req.body.username;
  if (players.find((player) => player.username === username)) {
    res.render("error", {
      message: `The username '${username}' already exists.`,
    });
    return;
  }
  const password = req.body.password;
  if (!password) {
    res.render("error", { message: "Invalid password." });
    return;
  }

  const id = accounts.length;
  const account = {
    id,
    username,
    password,
    vertexShader: "Put vertex shader code here.",
    fragmentShader: "Put fragment shader code here.",
  };
  accounts.push(account);
  players.push({
    id: id,
    name: account.username,
    xp: 0,
    useShaderForProfilePicture: false,
  });

  req.session.account = account;

  res.redirect("/");
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const account = accounts.find((account) => account.username === username);
  if (!account) {
    res.render("error", {
      message: `The username '${username}' doesn't exist, create an account first.`,
    });
    return;
  }
  const password = req.body.password;
  if (password !== account.password) {
    res.render("error", { message: "Wrong password." });
    return;
  }

  req.session.account = account;
  req.session.player = players.find((player) => player.id === account.id);
  res.redirect("/");
});

router.get("/shader", (req, res) => {
  if (!req.session.account) {
    res.render("error", {
      message: "You need to be logged in to see shader code.",
    });
    return;
  }

  res.render("shader", { account: req.session.account });
});

module.exports = router;
