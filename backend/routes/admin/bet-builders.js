const express = require("express");
const router = express.Router();
const { BetBuilder, Outcome } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const bet_builders = await BetBuilder.findForAdmin();
    res.json(bet_builders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/id", async (req, res) => {
  try {
    const bet_builder = await BetBuilder.findByIdAdmin(req.query.id);
    res.json(bet_builder);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const bet_builder =
      req.body.id == null
        ? await BetBuilder.createByAdmin(req.body)
        : await BetBuilder.editByAdmin(req.body);
    res.json(bet_builder);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/toggle-active/", async (req, res) => {
  try {
    var { id } = req.query;
    await BetBuilder.toggleByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await BetBuilder.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

router.get("/outcomes", async function(req, res, next) {
  try {
    const outcomes = await Outcome.findBetBuilders();
    res.send(outcomes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

module.exports = router;
