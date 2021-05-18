const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const os = require("os");
const envRouter = require("./env/router");
const appRouter = require("./app/router");
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get("/ping", async (req, res) => {
  res.json({
    status: "ok",
    data: {
      memory: {
        free: os.freemem(),
        total: os.totalmem(),
      },
      cpu: {
        arch: os.arch(),
      },
    },
  });
});

app.use("/env", envRouter);

app.use("/app", appRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
