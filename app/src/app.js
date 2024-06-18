const express = require("express");
const axios = require("axios");
const responseTime = require("response-time");
const redisClient = require("./db/redisConnection");

const app = express();

// Middlewares

app.use(responseTime());

app.get("/", (req, res) => {
  res.json({ user: "geek" });
});

app.get("/characters", async (req, res) => {
  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  redisClient.set("characters", JSON.stringify(data), (err, reply) => {
    if (err) {
      console.log({err});
    } else {
      console.log({reply})
      res.json({ user: data });
    }
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
