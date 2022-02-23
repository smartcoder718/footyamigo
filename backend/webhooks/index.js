const express = require("express");
const router = express.Router();

router.use("/coinbase", require("./coinbase"));
router.use("/paddle", require("./paddle"));
router.use("/flutterwave", require("./flutterwave"));
router.use("/lambda", require("./lambda"));

module.exports = router;
