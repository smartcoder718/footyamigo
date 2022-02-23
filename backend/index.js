require('module-alias/register')
const express = require("express");
const router = express.Router();


require("./db")

router.use("/webhooks", require("./webhooks"));
router.use("/api", require("./routes"));

module.exports = router;


