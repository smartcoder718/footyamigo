const express = require("express");
const router = express.Router();


router.use("/fixtures", require("./fixtures"));
router.use("/strategies", require("./strategies"));


module.exports = router;
