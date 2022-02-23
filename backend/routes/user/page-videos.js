const express = require("express");
const router = express.Router();
const { PageVideo } = require("@root/db");


router.get("/help", async (req, res) => {
  try {
    const video = await PageVideo.findAllByLocation('help');
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

router.get("/:location", async (req, res) => {
  try {
    const { location } = req.params;
    const video = await PageVideo.findByLocation(location);
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
