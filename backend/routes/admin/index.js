const express = require("express");
const router = express.Router();

router.use("/bet-builders", require("./bet-builders"));
router.use("/betting-systems", require("./betting-systems"));
router.use("/page-videos", require("./page-videos"));
router.use("/value-bets", require("./value-bets"));
router.use("/plans", require("./plans"));
router.use("/updates", require("./updates"));
router.use("/local-countries", require("./local-countries"));
router.use("/users", require("./users"));
router.use("/presets", require("./presets"));
router.use("/streaks", require("./streaks"));
router.use("/broadcast", require("./broadcast"));



module.exports = router;
