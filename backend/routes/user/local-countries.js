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

module.exports = router;
