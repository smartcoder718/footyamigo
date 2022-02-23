const express = require("express");
const router = express.Router();
const { BettingSystem, Strategy } = require("@root/db");
const isPro = require("@root/middlewares/isPro");

router.get("/", async (req, res) => {
  try {
    const betting_systems = await BettingSystem.findActive();
    res.json(betting_systems);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.use("/", isPro);

router.get("/id", async (req, res) => {
  try {
    const { id } = req.query;
    const betting_system = await BettingSystem.findOne(id);
    res.json(betting_system);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.post("/import/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user.id;
    const strategy = await Strategy.import(id, user_id, true);
    res.send(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

// router.post("/create", async (req, res) => {
//   try {
//     const betting_system = await BettingSystem.createByAdmin(req.body);
//     res.json(betting_system);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, messsage: error });
//   }
// });

// router.get("/toggle-active/", async (req, res) => {
//   try {
//     var { id } = req.query;
//     await BettingSystem.toggleByAdmin(id);
//     res.send({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: "Internal server error" });
//   }
// });

// router.get("/delete/", async (req, res) => {
//   try {
//     var { id } = req.query;
//     await BettingSystem.deleteByAdmin(id);
//     res.send({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: "Internal server error" });
//   }
// });

// router.get("/presets", async function(req, res, next) {
//   try {
//     const presets = await Strategy.findBetBuilders();
//     res.send(presets);
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .send({ success: false, message: "Interval server error occured" });
//   }
// });

module.exports = router;
