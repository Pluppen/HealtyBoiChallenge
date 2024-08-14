const express = require('express');
const pug = require('pug');

const router = express.Router();

const names = ["Tim", "Alex", "Pontus", "Elias", "Marcus", "Arif", "Estefan", "Mattias", "Zeph"]

let players = names.map((name, i) => ({id: i, name: name, xp: 0}));

router.get('/', (req, res) => {
    res.render('index', {title: "HealtyBoiGame", message: 'Hello there!', players: players });
});

router.post('/', (req, res) => {
    console.log(req.body);

    players = players.map(player => {
        if (player.id == req.body.id) {
            return {...player, xp: player.xp + 10}
        }
        return player
    }) 

    res.render('index', {title: "HealtyBoiGame", message: 'Hello there!', players: players });
});

module.exports = router;
