const express = require("express");
const router = express.Router();
const { Pick } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const picks = await Pick.findForAdmin();
    res.json(picks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const pick = await Pick.createByAdmin(req.body);
    res.json(pick);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const pick = await Pick.editByAdmin(req.body);
    res.json(pick);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await Pick.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
