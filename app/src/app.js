const express = require("express");
const responseTime = require("response-time");
const { router: employessRoutes } = require("./routes/employess.routes");
const { router: indexRoutes } = require("./routes/index.routes");

/* Instantiate Server */

const app = express();

/* Middlewares */

app.use(responseTime());
// Convert req to json
app.use(express.json())


/* Routes */

app.use("/api", employessRoutes);
app.use(indexRoutes);

/* Port */
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
