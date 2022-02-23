const express = require("express");
const router = express.Router();
const { Pick } = require("@root/db");

router.get("/", async (req, res) => {
  try {
    const user_id = req.user.user.id;
    const sent_to_user = await Pick.sentToUser(user_id);
    const sent_to_others = await Pick.sentToOthers(user_id);
    res.json({
      sent_to_user,
      sent_to_others,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
