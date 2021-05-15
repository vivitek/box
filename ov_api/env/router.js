const { execSync } = require("child_process");

const router = require("express").Router();

router.get("/:name", (req, res) => {
  const { name } = req.params;
  const tmp = {};
  tmp[name] = process.env[name];
  res.json({ status: "ok", data: tmp });
});

router.post("/", async (req, res) => {
  const { key, value } = req.body;
  execSync(`sudo echo "export ${key}=${value}" >> /etc/bash.bashrc`);
  res.json({ status: "ok", data: { key, value } });
});

module.exports = router;
