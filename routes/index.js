const express = require("express");
const pug = require("pug");
const fs = require("fs");

const router = express.Router();

const shaderDirectory = "./public/shaders";

let accounts = [];

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
const images = [
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,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",
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA8EAABAwIEAwUFBwMEAwEAAAABAAIDBBEFEiExE0FRBiJhcYEUMkKRsQcjUmKhwdEV4fAzcoLxc4PCJP/EABsBAAIDAQEBAAAAAAAAAAAAAAADAQIEBQYH/8QAKREAAgICAgEDAwQDAAAAAAAAAAECEQMhBDESE0FRBTJhFCIzkVKBof/aAAwDAQACEQMRAD8AAS2q5qezFdGCYjHMByG/yKq5YJad1pY3RkcnBIx58WT7ZWWcZLsSEsC+h2KQLckoH+Uy2tldPs0lNgUU1KxzXZXkXuq2tw6ejcQ9t2fiWlwafjUcZ8FOfCyRhD25r8l5vH9TzY8zjLas2vDFxtGDbolhW+KYMYyZacXbu4KnG9ui9BgzwzxuDMkouPY41OAaJsJbSWm7dE4qON0SkA0WztFuo6IlIC2pYTYS2oAdCWEgJYQAEaMbIIAMJQSQlBQQKQCCAQApGESUEAGgjQQBatA3Dhr0QlhjmYWShr2nk4Xus12exkWbSVb7OHuO8Oi04IOoFl4yp4ZVJUzpakilrezNJKC6mJhf0vdqz1dhVXQ6ywks5PZst8POyNwBaQbOB3B5rpYOflhqW1+RMsUX0Y7s7XcKUwPdodvNatuwubmyq8RwCOUcWhHCmGuX4SU7htS/LwKphbKzQgrJz1GUvVhpPsZi0qZZ2adHa35KgxjCr5pqduo3Hgr4HQIyGkWdzVOLyJYZpx6JnBS7MIEsK8rcHBqg6M2a43ciqcDyMzRuudwF6SPNxSrfZjeOSKqI2drsdClPbldbly8khzCw5XCxBT1+JDpuxa00+hY2EsJvYpxpUgONS2poOF9U6wjM23VACnJLnhu5sm552RMJdqQdB1TNJG6qlDpTv8PRUnNLSLxhe2WsFO2SJzg7UapkX5m6mhns0Bba1woQKiF+5ExSCIIBMKiglhI5pQUEDiCJBAGJDvMeIWhwTHnU5ZBUkuZyJ5LKNqiTYhoUlklxbQeIXD5PJ42eNSTT+TpQ4uaPVUdQhkjlYHt7wOxTgy22ssFheLy0DxkdnZfvNWzocRhrYw6F9zzHRcpTinTdjJ4ZRVtEsEck1U07KhozCzuThuEu9uRHkiz26+qu6aqQpWNNjdG0NcM3j1S2kchZG6QW1VVimKQ4ZGJ5pAG7ZSVllGnUC62WjxmCQ6oiY20rgABzKw2Mdv6NsVsPIkl21Ng1ZCr7TVc4L56kkOcRZmoWrBxs05X0RKkdDxmsoSQ5tRGNbXGtk3S5HAuMu40B2cDuL/5uuaYeG1JkdPJfMbffdx4HXxVph2OYHRzsjqcVeyTNZxabhvJd/CpxXjZnlGPZayYo+DFTSVDXA5y0OBtfX+VPm40EETpZjlcCXSRjNwx1PhqEjEMHGMww1VHWtmdHqDH8YsPkbfss5VYzVYXPPQ1URdG9hZmdsSTc+ew+aZcr2RUa0WrcSfDVMo64iOaUO4cjX911jaw8Ve00c3BfUCS8TLhxPw6c+iykctLi1MeG9rZoZuJEWi1nXJWywCcvpcoAcHkRua3TyR5OyKQk0Ejg1+dr29W7KzpuFAwFydpcHGG4Y+J84aMznGSTTIN1UxzxVOYQVcNTk+KN4/Wyna2SqbosZp87T05JgIaiNoO4RBPxO1bFZVUtBowiQTBYtKCQlBADiCJBAGRlwV7Scn67KM+inidYi62wpi51w1EaNxuDHcL56uRk90d9ZKMUBKzRwspFNVS08gdE/KVp34bGbtcy2l0w7CIHAWFlPrp9oasyraJWG9poyMlXdrre9yVzHVQzszMeCD0WWfgkO5eRfTRRTh89ObwVT4wDbdWjmXSYiWPG9o0WJVvAjc7NsFxjtj2gNZixaZDkboWk6Fa3GMTrRS1DJ7SZG2a5g1XJKinreO6SSlqM7jckxldv6XxfJvJIyZZ+noszVFxyjKXe7mUqhu18b6hrgRo0loufVU9M6SB+apjcNNA8fyFe0dfEzh/c3kZqH3vbyGy6k4+OhS32Jr4cUxGuZQU0E0R4bpXF4y3YNz+3qqPGcGfhRiMzi4S3sRyta63tH2oe+YAiGXKLNdIyxbf83L6JzEhhWLwBuIQkR945oXkFp6i9/wCOiZDJToXON7MpTS492bw2gxmmnPsNY94iaXXzFls1xy3Vy3tNR9pIHR4gBHMRYX+t0eK4Th8zaaPi4m+kjBbE2PIWN2va5uD+LTks1i9FSwnJQwSNaLgkuNyVduLKxTLHDq0YVVFjHscyM2zE7+a6D2Ox5z6tvFELnZswYHWOgv8AS65XHhktSxrKNjnOtowOGvhZFBUzYbWNkxGGXitIHCku0gDnqlODl0x8a6Z2nt7izKp1EZxL/S3SiObg65CdA5/QXsFIoexUeC1zKuKdxikb7j9ST5qojko5aeGqNPLOHsYwQtJ72e+h9AT6LS43ic7GU1C6KoaGBjmyxtABy20ufkpTuOymTG4SXwE+MMfpew5E7I73T0rH1ERlAGa1y1qih4yi5u78I3WnG7RnyLdjiF0jvO1IsEsW5JhQCW1JCVdADiCRdBAFgzROA30TYN2eSUNl87idgczcjYg6WKS6nZILBobba3VAJQNgm6emQQZ4Hxm7h3eviq+sOSF5ItYXKvTlIIdax3ubLIdrqTGGTsnw2dr6FxtPDw/vGjqDzCrHjxlKk6JUt0c77f4hJBRQRxPcx87y9xa6xtyWVw3Hq6FxbNPJKzoZHAq1+0aS+KRRfCyFtumqpsPw7jQcYyezh3xzANj+Z39F7LgQUePH8mLkO8hf0uPMlkYPbsSpgOQkEjT6HVTagQVpzf1eIuOwlpMvzIaqagwqIPDziEEzulOWn9Xlv0U6aEtaS2lzhu4lrY2j9P5TJptlY12SBh8gsGVuFvduBxspJ9bJ91FifEzs4MspJs2Cphdl8hm2UWmjraiIXpKVkXK9W4j5terKg7Pe0ZixtKeromyPy+bnXHzUV+AbGHy4jGTHUsmYHEFzXM0059P+lGNA99RamjnqHjvNEMTWNFh7pJJ/ZT5aHDaIFj6imqHONnM4pefICNtvm4KNDI2qmEHs4paSCxHs+fiW8QHED5qaCyVhMDhUQVNJRwxVL78WGSpN2vGmg10sNV0h2F4djlG+HFYoHMcLNOlx4tPW+38rF4FhuGsbBNHR1MmWR7WveLEE6kusVqIIKShomsEYkmjL+DDfM5999L9ddeiuokeWxPZeldhGMVEFRUCSGmyta4gAnu6E+V7eq2Ne4ywNc2FsrCe+0EX9Fg8DZXtxOWepicBOSS7MCW9NOYtbZbOOOJtMI5oTK3Lbunbw66KGWk9oApfZ4nHOeGRo1tgB5kqmY83LW5LX5G6v8PhaYmtglvE3ZkjdW+Atb6KFPAGTPbxowQfL9lbGJyEMB3Vo9CjDTzcPQJ4wv5SMcfCRE6GUauY76pwsbAtzulBJt4EeYRhSAtBEggCcwjKLJwapLSlBfPEdgUdLeaIu95Kacpui0vrzTFTIEA3aFGrgfZ3d7KOqmnKBYbjrsoWIF/Afl0dbQ2VvFJbION9u4qh2OSOoqJhflaPaZyLDyzd0LJ/0yaomLqiqdLJz4YLz83WH6q7+0QOPaKYiZjQA3Uu1vboNVnqemnF5pagwQk6ySktzeQ3K9jw/4I18GLN95eU2HNghBe1rW/iqagC3o3+VLp6SkceL7U7ht2fSwtiaP/a8/QrOe2UzHhmH0ftM7tBJO3Nc/lZ/N1Oko8rhP2gmmqZwO5Rwn3f9zhoweA18k7xrbK+V6RoqWahfLkoqM1c7Pic0zOb455LNb55bK1jmbXO4U8hrJGj/AEopOIyMdXPNox6MPmsjG2orog2SUUeHRm5hiZlZ5AHVzvEq0ZiLRC2lw+Esp26i5JzEc3H4ilSaLJfJfztw6kia6aCF4t3GRs0d4C+pHj3W+BVBUYlNW1cHHaIKZhPCgjIDWgaXDdr3sLnxttZOxxSVAc+eRwcWm7tyBzI8Ry8SEzFSB8pdkbqO7b4RyAVUyaLuir6qpibTxFzbtDXOzG1hfQC/qtNgzY4qxsGTilwD3k+8SdvqVm8KpyyRgcSANbnT/Oa1XZ0tlqnzuaMuW7P1TIOyktGupo6eYtbI0ENOZp5apyooGOmaWE2dvY7JvAw7L3mm56q6IHDu4WCdSF+Tsq5ZDGQ22Zx1zDf1VXWSvExzBp8xorWZkLy57PhVHLITI7mCdkuCfmWlVBZ4nbtyHw1H6f3RgEatJcOrTf8ARNOtyQaSDcaeKeKHc5O5B80Ljnb0RZw73t0LAbIAO7UESCAIdF2mw2e+aXhX5PFlaxYhSytAZURP6EPC5RZGMw1BsvFfpY+zO54HXW1UJbYyxh3XMNk1PidFABnqorjlmH0XLGTOG5uFLp5Wm/gFV4aI9P8AJs63tNDHmZQs4j7avfdrR/KysuM4lVYnCZahxga8XY0ZW6nmiYcre7r4dVV4rnGV4OxuB0KZiUX+1olRSKr7QjHRY+JYYBJI9rS18guG8tB10WKmjqK2utK8uc7dzz7o/hdA+0GP2rDMOr2t7z4y0nxGt/qsViIvh8boToNHu6heh4GS8Mf6MGeHbDjqqfD2GHDnkzEWkqsuv/HoE3E9j35qmq7rd2s2+fNVrGl3v3DBuQpsMWcXyhse4b08fNbp0Z4k1tUKmVtmuaxn+mNf0CuqId1tyQPEKmgjazvZfU/VTqJ8by1plcDp7rLErJLsci/aTw+GT3jqTbc8lKo47G4369VAog94Ms7CNwy2zitLhtA8shfLcNeMx5aK0VZD0HR0TnuyEanmtfglDlY2wsGmwUfDqNj5mhg72Qk/Pl6LU4dTNEbH2s2ydGNCZSssKKOzAUud+QFx1AGyJnd73oFFqn2aXHY6K8mViiqnla10hjblc7VVh1NzuVMrJI2tLRuoZ2CiC9yZP2CJSboO3QCYUFtTgKbCUFICroIIIA5rbwsiIT8UL5NGgZep0ClR0MTXffy+jAvIOaR37RW25pUb3B12turuD2aB12UkZ/8AIM11YxYo9rrRZGNtqGtDfolyz/giyjp+M4m8bySNMrbpdZSudSPe6CYtY3N3YySfCy0lLicjntD3EN5dQr+iqLtHfza7rP8AqKmrRWUnRy+ggmxzs5LSSU7454Xl8TJWEX30/wA6rFQRBs0tHMw8NwsL8uv7j0XpFrg59jaxHNcz+1DssWPbitHGMrnfeAD3HW3Ph19F1eFyl5uPSf8AxiJJSWzkL4H01S6GfulmzidApdJJZxLCHOOozakDmVY4jR/1alzxD/8ATCCMvXqs799SPMb2OY69y1wsf83XfVTRimnCRo4yCzvgObsxgFteZ+ilUQYXkBuV+4AFreF/l81Q01faZpOjXAN/49PoryhkzxuJiyvJsenT9klwosmamhg4uUZXO75vr7p0t6ahaWla7K2F8Ju0G5B5je6yWDPoKx7WfeRSaHe1iNVuaR0cMMbjK4WzC7t9VeJRlhSdyRmVr7tsXG1wrKDEzHNw33LXnQhZ3GMZZQ0jnQvY6cA2a74h4Knw/tBPWzxySQup2stpe6u5qJCg5HVYjnbbMfVVWMzGMAA3T2F1jKmAPikJJGt0msYKqEtHvjZKnyYRkosFilVlBmJJJ5ockTgWPLTuN0YWtV7CRJQCN26IIAW1KSAlhABoIkEAYR0hLbEAeSWx1m5b6bkHZNWbfR1+gSgN7ixsvHNHcskxHNmJFrCxSmuLoyB731UePOHHpdSWag26WKW0FjgfZwIdYt535q0oqx8Tg13evuLqrbrlAOh2Ft1Ji0c55JIOl76JE4poLNRS1odtu3bzUqsdT1dJJFUBpY8ZXB2xvyWfpHCNzMhacx90c/JTMQwiPE4WisLixhu2EWLQfxHqQlY24yq6QuSVnNe0fZrEMIqXVVI1xhYbhw2t49PNU0k9NW5Y62IZ9BZ3W3/a7DTUmI0jDFBNHUwc46gagdL/AMqqq+z2FzzvkqcKqaVxdcmA5m/Jdrj/AFKo/u/sq4o5l/R8Me/QZfInkptLhjYc3AqpGG2xNwR5K/w6j7J4nU+x0FfVTVj35Y4+DuL68vNbKP7OqAM7tTPceI/hb3y67sr4412YSnZwp2S5Iy23esLX8U5W442mjZGxjnSSGzGt5LZ4l2Pw7C6KSqkfPK1jbkC11zAVsTe1EDo47skdlaJH7C6vi5HqS8UR6eNq0aCOkllaHVDszzqSU5WgQUREW5IClTOIeI2+6Ck1Qa5ve2CtKTY+MYpOjT9nKh0EFOXdLLTvJaRK33Tuslhrs1KwDkNFosLquKwwSdLBK52DSyR/2YMc6k0xvFKYEcaPfmqwWtormeTgNMUmx2VO73jba618OU5Y6kJypXoCHNEgFsFCglBJCO6AFoJN0EAc+ZqCPknmG8YbtbW/VVdPjWHytAM4Hg4EKYzFMOLg32mLblIF5WWLJ/izs+a+SfCWuNzp0UgNHK+fbTmqx+L4c1jne0R6dHDT0UGp7UUbARE+SQ3+Ftr/ADSlx8s3pMPOPyaEyRNaXXIPQqHPi/BLY295zzla21y49AOqx9b2mqJCREwxXPmVs/srwkTRS41VxF0hkDaeSQ62G5Hht+qfLiLDjeTKV9RXSNfgmGvo6ds1Rd9Y/wB8b8P8oVmCO9lNxcapV7PJNyzncpDhu7N/dcKcvJ2WJMViTdR8TxGOjgLzuNAOqi1FXwGXD7HkVkMRxB+IVeVh7rTYa7lOwpzLRhbtkv7KuzjYq7EsenZ35KiWOAH4W5jcrpjSOSg4PTCjw6CACxa3XTmp2vJdn1HkfkzJOrpDWJUra+gnpZB3ZWFt+i4TX4ayPHqFjw4OjqHghv5f7hd8bmuR1C5n9oNAKTtJRVoFopXZi782x/Sybjl45FIvge/FlfICakkDzJVs/Bpv6Xxphlc4XaOif7PYT7XX8V5vHHqVq8TGWmLLXsF0FHVlsmRJ+KMphQIp2g7jQqxikMUge3kVAoRlJFrd4qatqipw8TnS1IvKhra6kBb7wF/VUjmlpIO/NSsPqTDLlPunVDEXxSPDo/eWfApYpPG+vYmdS2RAlBI5lLC2igIwiRhQAEEEEAednS5W3SqN13kqLPO5wy/spVFGWi5SGqRqsXU3zeCOIi2iTKSX6J1rnBoS/YuhVHSS19fDTQNvJM8Mb5lehcPoYcPoKehh/wBOnY1rT1tzXKfswoRWdoHVEvu0sReP9x0H1K62HNDS118oOll536znuSxfGzRjXuE9wy6JiWUMFj8QS5Dl0BsLfEqXFasQwnM5cWMfKVD4oqsfxHiDhM3um+zVMKjE6dv57n03VM+Qz1LnE31sFrOxEWbFQfwsJXVWNY4KKGvUGdCbsEoJsAbHkUsW5J8Wc5i1R9rez7e0FAyHjcF8T87X2vbRXdkYbunQKp1tFNgVAcOhET35383dU9WsfJmZyUyId53mkVFgDdddfail3K2ZuWDhvsk8lNrsub0UI25LVi+0z5PuCQRXQTCgYSgkBKBQAtEiuhdABoIroIA85U0WZ40urhsByaaIkFlyM2QI9TGWN1SGO23QQVfYsdR+yaENo6+bKMz5GsDh+UE//S3T3kjMee1kEF5H6lvkys04+iNUSZW29Vke0VSXiw6oIJXDivUHIqKVhzXK13YyZrcbNNa7uAX39f7IILp5Yp2Xn/GzoAO+lkd0SClHPYoHVOt2QQTYdlGMSOyNJ8VCc/NdyCC7EekQUlXKOIbqNxWoILZDoyy7EmVqLihBBXKhiZqMTNQQQADO1EZ2oIIALjtRoIIA/9k=",
];

function createAccount(username, password) {
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
    xp: 0,
    img: images[id % images.length],
    level: 0,
    maxxp: 100,
  };
  accounts.push(account);

  return account;
}

for (const name of names) {
  createAccount(name, name);
}

router.get("/", (req, res) => {
  res.render("index", {
    title: "HealtyBoiGame",
    message: "Hello there!",
    loggedInId: req.session.accountId,
    accounts: accounts,
  });
});

router.post("/", (req, res) => {
  let modalInfo = null;
  accounts = accounts.map((account) => {
    if (account.id == req.body.id) {
      let xpMultiplier = 1;

      if ("remove-xp" in req.body) {
        xpMultiplier = -1;
      }

      let xp = account.xp + 10 * xpMultiplier;
      let level = account.level;
      let maxxp = account.maxxp;

      if (xp >= maxxp) {
        level += 1;
        xp = 0;
        maxxp = level * 100;

        modalInfo = {
          title: "You Leveled Up!",
          description: `You leveled up to level ${level}`,
          extraHtml: '<i class="nes-icon is-large star"></i>',
        };
      }
      return { ...account, level, maxxp, xp };
    }
    return account;
  });

  res.render("index", {
    title: "HealtyBoiGame",
    message: "Hello there!",
    accounts,
    loggedInId: req.session.accountId,
    modalInfo,
  });
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
  if (accounts.find((account) => account.name === username)) {
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

  const account = createAccount(username, password);
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
