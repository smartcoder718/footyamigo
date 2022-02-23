const express = require("express");
const router = express.Router();
const { Update } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const updates = await Update.findForAdmin();
    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

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

router.get("/toggle-completed", async (req, res) => {
  try {
    const update = await Update.toggleCompleted(req.query.id);
    res.json(update);
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

router.post("/create", async (req, res) => {
  try {
    const update = await Update.createByAdmin(req.body);
    res.json(update);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const update = await Update.editByAdmin(req.body);
    res.json(update);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await Update.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
