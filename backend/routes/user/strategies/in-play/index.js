const express = require("express");
const router = express.Router();

const { Strategy } = require("../../../../db");
const { body, validationResult } = require("express-validator");




// router.get("/preset-alerts", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll(
//     "in-play",
//     user_id,
//     "preset-alerts"
//   );
//   res.json(strategies);
// });

// router.get("/explore-alerts", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll(
//     "in-play",
//     user_id,
//     "explore-alerts"
//   );
//   res.json(strategies);
// });

router.post(
  "/create",
  body("title").isLength({ min: 3, max: 50 }),
  async (req, res) => {
    try {
      const user_id = req.user.user.id;
      const strategy = await Strategy.create(req.body, "in-play", user_id);
      console.log("USERSTRATEGY", strategy);
      //user.addStrategies(strategy)
      res.send({ success: true, message: "Strategy created" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: true, message: "Internal server error" });
    }
  }
);

// router.get("/:alerttype", async (req, res) => {
//   const user_id = req.user.user.id;
//   const strategies = await Strategy.findAll("in-play", user_id, req.params.alerttype);
//   res.json(strategies);
// });

// router.get("/id/:id", async (req, res) => {
//   try {
//     const user_id = req.user.user.id;
//     const { id } = req.params;
//     const strategy = await Strategy.findById(id, user_id);
//     res.send(strategy);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: true, message: "Internal server error" });
//   }
// });

module.exports = router;
