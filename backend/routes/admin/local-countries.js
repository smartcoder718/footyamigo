const express = require("express");
const router = express.Router();
const { LocalCountry } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const local_countries = await LocalCountry.findForAdmin();
    res.json(local_countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const localcountry = await LocalCountry.createByAdmin(req.body);
    res.json(localcountry);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const localcountry = await LocalCountry.editByAdmin(req.body);
    res.json(localcountry);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/delete/", async (req, res) => {
  try {
    var { id } = req.query;
    await LocalCountry.deleteByAdmin(id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
