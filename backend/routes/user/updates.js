const express = require("express");
const router = express.Router();
const { Update } = require("@root/db");

router.get("/changelog", async (req, res) => {
  try {
    const updates = await Update.findChangeLog(req.query.page);
    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});
router.get("/roadmap", async (req, res) => {
  try {
    const updates = await Update.findRoadMap(req.query.page);
    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/id", async (req, res) => {
  try {
    const update = await Update.findByIdAdmin(req.query.id);
    res.json(update);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});


module.exports = router;
