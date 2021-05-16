const router = require("express").Router();
const { execSync } = require("child_process");
const path = require("path");
router.patch("/restart", (req, res) => {
  execSync(
    `docker-compose -f ${path.resolve("..", "docker-compose.yml")} restart`
  );
  res.json({ status: "ok", data: { message: "containers restarted" } });
});

module.exports = router;
