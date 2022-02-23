const express = require("express");
const router = express.Router();
const { Streak } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const streaks = await Streak.findForAdmin();
    res.json(streaks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/market", async (req, res) => {
  try {
    const streak = await Streak.findByMarket(req.query.market);
    res.json(streak);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const streak = await Streak.createByAdmin(req.body);
    res.json(streak);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const streak = await Streak.editByAdmin(req.body);
    res.json(streak);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await Streak.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
