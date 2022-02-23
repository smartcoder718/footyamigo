const express = require("express");
const router = express.Router();
const { User } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const users = await User.findForAdmin();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/issue-subscription", async (req, res) => {
  try {
    const { plan_id, email } = req.body;
    const user = await User.issueSubByAdmin({ email, plan_id });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/update-expiry", async (req, res) => {
  try {
    const { email, end_date } = req.body;
    
    const user = await User.updateExpiryByAdmin({ email, end_date });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/delete-subscription", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.deleteSubByAdmin({ email });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = await User.createByAdmin(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await User.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
