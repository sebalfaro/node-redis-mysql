const express = require("express");
const axios = require("axios");
const responseTime = require("response-time");
const redisClient = require("./db/redisConnection");
const { promisify } = require("util");

const app = express();

// Middlewares
app.use(responseTime());

// Routes
app.get("/", (req, res) => {
  res.json({ user: "geek" });
});

const GET_ASYNC = promisify(redisClient.get).bind(redisClient);
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);

app.get("/characters", async (req, res) => {
  try {
    // Response from cache
    const redisGet = await GET_ASYNC("characters");
    if (redisGet) return res.json(JSON.parse(redisGet));

    const { data } = await axios.get(
      "https://rickandmortyapi.com/api/character",
    );
    const redisPost = await SET_ASYNC("characters", JSON.stringify(data));
    res.json(redisPost);
  } catch (error) {
    return res.status(error.response.status).json({ message: error.message });
  }
});

app.get("/characters/:id", async (req, res) => {
  try {
    const reply = await GET_ASYNC(req.params.id);
    if (reply) return res.json(JSON.parse(reply));
    const { data } = await axios.get(
      "https://rickandmortyapi.com/api/character/" + req.params.id,
    );
    await SET_ASYNC(req.params.id, JSON.stringify(data));
    return res.json(data);
  } catch (error) {
    return res.status(error.response.status).json({ message: error.message });
  }
});

// Port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
