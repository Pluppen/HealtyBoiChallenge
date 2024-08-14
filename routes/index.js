const express = require("express");
const pug = require("pug");

const router = express.Router();

const names = [
  "Tim",
  "Alex",
  "Pontus",
  "Elias",
  "Marcus",
  "Arif",
  "Estefan",
  "Mattias",
  "Zeph",
];

const players = names.map((name, i) => ({
  id: i,
  name: name,
  xp: 0,
  useShaderForProfilePicture: false,
}));
players.find((player) => player.name == "Alex").useShaderForProfilePicture =
  true;

router.get("/", (req, res) => {
  res.render("index", {
    title: "HealtyBoiGame",
    message: "Hello there!",
    players: players,
  });
});

router.post("/", (req, res) => {
  console.log(req.body);

  const player = players.find((player) => player.id == req.body.id);
  player.xp += 10;

  res.render("index", {
    title: "HealtyBoiGame",
    message: "Hello there!",
    players: players,
  });
});

module.exports = router;
