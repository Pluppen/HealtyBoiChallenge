const express = require("express");
const pug = require("pug");
const fs = require("fs");

const router = express.Router();

const shaderDirectory = "./public/shaders";

const accounts = [];
const players = [];
router.get("/", (req, res) => {
  if (req.session.accountId !== undefined) {
    res.render("index", {
      title: "HealtyBoiGame",
      message: "Hello there!",
      accounts: accounts,
    });
  } else {
    res.render("login", { title: "Login" });
  }
});

router.post("/", (req, res) => {
  console.log(req.body);

  const player = players.find((player) => player.id == req.body.id);
  player.xp += 10;

  if (req.session.accountId !== undefined) {
    res.render("index", {
      title: "HealtyBoiGame",
      message: "Hello there!",
      accounts: accounts,
    });
  } else {
    res.render("login", { title: "Login" });
  }
});

router.get("/account", (req, res) => {
  res.send(
    JSON.stringify(
      accounts.map((a) => {
        delete a.password;
        return a;
      }),
    ),
  );
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
    vertexShaderCode: fs.readFileSync(
      `${shaderDirectory}/default/shader.vert.glsl`,
      { encoding: "utf8" },
    ),
    fragmentShaderCode: fs.readFileSync(
      `${shaderDirectory}/default/shader.frag.glsl`,
      { encoding: "utf8" },
    ),
    useShaderForProfilePicture: false,
  };
  accounts.push(account);
  players.push({
    id: id,
    name: account.username,
    xp: 0,
  });
  account.player = players[players.length - 1];

  req.session.accountId = account.id;

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

  req.session.accountId = account.id;
  res.redirect("/");
});

router.get("/shader", (req, res) => {
  const account = getAccount(req.session.accountId);
  if (!account) {
    res.render("error", {
      message: "You need to be logged in to see shader code.",
    });
    return;
  }

  if (fs.existsSync(`${shaderDirectory}/${account.id}/shader.vert.glsl`)) {
    console.log(
      `Loading vertex shader code for account ${account.id} from ${shaderDirectory}/${account.id}/shader.vert.glsl`,
    );
    account.vertexShaderCode = fs.readFileSync(
      `${shaderDirectory}/${account.id}/shader.vert.glsl`,
      { encoding: "utf8" },
    );
  } else {
    console.log(
      `No vertex shader code exists for account ${account.id} at ${shaderDirectory}/${account.id}/shader.vert.glsl`,
    );
  }

  if (fs.existsSync(`${shaderDirectory}/${account.id}/shader.frag.glsl`)) {
    console.log(
      `Loading vertex shader code for account ${account.id} from ${shaderDirectory}/${account.id}/shader.frag.glsl`,
    );
    account.fragmentShaderCode = fs.readFileSync(
      `${shaderDirectory}/${account.id}/shader.frag.glsl`,
      { encoding: "utf8" },
    );
  } else {
    console.log(
      `No fragment shader code exists for account ${account.id} at ${shaderDirectory}/${account.id}/shader.frag.glsl`,
    );
  }

  res.render("shader", { account: account });
});

router.post("/shader", (req, res) => {
  const account = getAccount(req.session.accountId);
  account.vertexShaderCode = req.body.vertexShader;
  account.fragmentShaderCode = req.body.fragmentShader;

  if (!fs.existsSync(`${shaderDirectory}/${account.id}/`)) {
    console.log(`Creating directory '${shaderDirectory}/${account.id}/'`);
    fs.mkdirSync(`${shaderDirectory}/${account.id}/`);
  }

  console.log(
    `Writing file '${shaderDirectory}/${account.id}/shader.vert.glsl'`,
  );
  fs.writeFileSync(
    `${shaderDirectory}/${account.id}/shader.vert.glsl`,
    account.vertexShaderCode,
  );

  console.log(
    `Writing file '${shaderDirectory}/${account.id}/shader.frag.glsl'`,
  );
  fs.writeFileSync(
    `${shaderDirectory}/${account.id}/shader.frag.glsl`,
    account.fragmentShaderCode,
  );

  account.useShaderForProfilePicture =
    req.body.useShaderForProfilePicture === "on";
  console.log(
    `Set useShaderForProfilePicture to ${account.useShaderForProfilePicture} for account ${account.id}`,
  );

  console.log(`Updated shader settings for account ${account.id}`);
  res.redirect("/");
});

function getAccount(id) {
  return accounts.find((account) => account.id == id);
}

module.exports = router;
