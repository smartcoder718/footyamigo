const express = require("express");
const router = express.Router();


router.use("/pre-match-rules", require("./pre-match-rules"));
router.use("/in-play-rules", require("./in-play-rules"));


module.exports = router;
