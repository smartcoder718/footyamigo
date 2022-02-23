const express = require("express");
const router = express.Router();
const { User, TelegramToken, Strategy, Fixture, Pick } = require("../../db");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const admin = require("firebase-admin");
const { body, validationResult } = require("express-validator");
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(accountSid, authToken, {
  logLevel: "debug",
});
const hasPhone = require("@root/middlewares/hasPhone");

const uuid = require("uuid");

async function getHighlights() {
  const fixtures_today = await Fixture.getTodaysCount();
  const live_games = await Fixture.getLiveCount();
  const alerts_sent = await Pick.getTodaysCount();
  const strategies_created = await Strategy.getTotalCount();
  return [
    {
      subtitle: "Matches",
      count: fixtures_today,
      title: "Today",
      id: "fixtures_today",
    },
    { subtitle: "Matches", count: live_games, title: "Live", id: "live_games" },
    { subtitle: "Picks", count: alerts_sent, title: "Today", id: "picks" },
    {
      subtitle: "Strategies",
      count: strategies_created,
      title: "All time",
      id: "strategies_created",
    },
  ];
}

async function checkPhoneExist(phone) {
  const user = await User.query().select("id").findOne({ phone });
  return user ? true : false;
}
async function checkUserHasPhoneAdded(user_id) {
  const user = await User.query()
    .select("id")
    .findOne({ id: user_id })
    .whereNotNull("phone");
  return user ? true : false;
}

// router.use("/", async function (req, res, next) {
//   const body = { id: req.user.id, email: req.user.email };
//   const token = jwt.sign({ user: body }, process.env.AUTHJWT);
//   const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
//   const cooks = res.cookie("token", token, {
//     maxAge: 1000 * 60 * 60*24*3,
//     httpOnly: true,
//     domain,
//   });
//   console.log(cooks);
//   next();
// });

router.post("/phone/send-otp", async function (req, res) {
  try {
    const user_id = req.user.user.id;
    const { phone, channel } = req.body;
    console.log(req.body);
    if (await checkUserHasPhoneAdded(user_id)) {
      return res.status(400).send({ message: "User has already added phone" });
    }
    if (await checkPhoneExist(phone)) {
      return res.status(400).send({ message: "Phone number already in use" });
    }

    const verification = await client.verify
      .services(serviceSid)
      .verifications.create({
        to: phone,
        channel: channel == "sms" ? "sms" : "call",
      });
    res.send({ sid: verification.sid });
    //res.send({ success: false, message: "Token issued", activation_token })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

// User.query()
//   .patchAndFetchById(1, {
//     phone: 7086114540
//   })
//   .then(user => console.log(user));

router.post("/phone/confirm-otp", async function (req, res) {
  try {
    const user_id = req.user.user.id;
    const { phone } = req.body;
    console.log(req.body);
    if (await checkUserHasPhoneAdded(user_id)) {
      return res.status(400).send({ message: "User has already added phone" });
    }
    if (await checkPhoneExist(phone)) {
      return res.status(400).send({ message: "Phone number already in use" });
    }

    const verification_check = await client.verify
      .services(serviceSid)
      .verificationChecks.create({ to: req.body.phone, code: req.body.otp });
    console.log(verification_check);

    if (verification_check.status === "approved") {
      const user = await User.query().patchAndFetchById(user_id, {
        phone: verification_check.to,
      });
      await User.syncWithMongo(user_id);
      res.send({ message: "Phone confirmed", success: true });

      const message_lines = [
        `Hey ${user.firstname}, 👋`,
        "",
        "Your phone is now linked successfully! 🎉",
        "",
        'You will now be able to receive alerts from your strategies on <a href="https://footyamigo.com">FootyAmigo.com</a>',
        "Enjoy! 💸",
      ];
      return await admin
        .firestore()
        .collection("alerts")
        .doc(uuid.v4())
        .set({
          message: message_lines.join("\n"),
          user_id: "" + user_id,
          sending_time: moment().unix(),
        });
    } else {
      return res.status(401).send({ message: "Invalid otp", success: false });
    }

    //res.send({ success: false, message: "Token issued", activation_token })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

router.get("/telegram/associate-account", async function (req, res, next) {
  try {
    const user_id = req.user.user.id;
    const telegram_token =
      (await TelegramToken.findUserToken(user_id)) ||
      (await TelegramToken.generateToken(user_id));
    const { activation_token } = telegram_token;
    const botusername = process.env.BOTUSERNAME || "footyamigobot";
    res.redirect("https://t.me/" + botusername + "?start=" + activation_token);
    //res.send({ success: false, message: "Token issued", activation_token })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

router.get("/telegram/deassociate-account", async function (req, res, next) {
  try {
    var user_id = req.user.user.id;
    await User.delTelegram(user_id);
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ success: false, message: "Interval server error occured" });
  }
});

// router.get("/firebase/refresh-token", hasPhone, async function (req, res) {
//   try {
//     const user_id = req.user.user.id;
//     const uid = user_id + "";
//     const firebaseCustomToken = await admin.auth().createCustomToken(uid);
//     console.log("Login success:", firebaseCustomToken);
//     return res.json({ firebaseCustomToken });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .send({ success: false, message: "Interval server error occured" });
//   }
// });

router.get("/profile", async function (req, res, next) {
  try {
    //console.log(req.user);
    const user = await User.findById(req.user.user.id);
    const {
      role,
      id,
      email,
      firstname,
      lastname,
      telegram,
      subscription,
      seen_intro,
      avatar_id,
      power,
      phone,
    } = user;
    const scope = ["user"];
    if (user.power == 10) {
      scope.push("superman");
    }
    const user_info = {
      role,
      id,
      email,
      firstname,
      lastname,
      fullname: firstname + " " + lastname,
      telegram,
      subscription,
      seen_intro,
      avatar_id,
      power,
      scope,
      phone,
    };

    res.send({ user: user_info });
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Unauthorized" });
  }
});

router.post("/seen-intro/", async (req, res) => {
  try {
    const user_id = req.user.user.id;
    await User.doNotShowIntro(user_id);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
});

router.get("/highlights", async function (req, res, next) {
  try {
    const highlights = await getHighlights();
    res.json(highlights);
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Unauthorized" });
  }
});

router.post(
  "/update-profile",
  body("firstname").isAlpha().isLength({ min: 3, max: 20 }),
  body("lastname").isAlpha().isLength({ min: 3, max: 20 }),
  async (req, res) => {
    try {
      const result = validationResult(req);
      const hasErrors = !result.isEmpty();
      if (hasErrors) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid Name", errors: result });
      }
      const user_id = req.user.user.id;
      await User.updateProfile(user_id, req.body);
      res.send({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed" });
    }
  }
);

router.post("/update-password", async (req, res, next) => {
  req.body.email = req.user.user.email;
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        console.log(err);
        return res.status(401).send("Login failed. Server error occured.");
      }
      if (!user) {
        return res.status(401).send("Login failed. Invalid credentials.");
      }
      await User.updatePassword(user.id, req.body.new);
      res.send({ success: true });
    } catch (error) {
      res.status(500).send({ message: "Failed" });
    }
  })(req, res, next);
});

router.get("/logout", async (req, res, next) => {
  const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
  return res
    .clearCookie("token", {
      domain,
    })
    .send({ success: true });
});

router.use("/strategies", require("./strategies"));
router.use("/countries", require("./countries"));
router.use("/coinbase", require("./coinbase"));
router.use("/paddle", require("./paddle"));
router.use("/transactions", require("./transactions"));
router.use("/flutterwave", require("./flutterwave"));
router.use("/fixtures", require("./fixtures"));
router.use("/picks", require("./picks"));
router.use("/page-videos", require("./page-videos"));

router.use("/local-countries", require("./local-countries"));
router.use("/outcomes", require("./outcomes"));
router.use("/bet-builders", require("./bet-builders"));
router.use("/betting-systems", require("./betting-systems"));
router.use("/stats", require("./stats"));
router.use("/leagues", require("./leagues"));
router.use("/odds", require("./odds"));
// router.use("/quickalerts", require("./quickalerts"));
router.use("/rules", require("./rules"));
router.use("/updates", require("./updates"));
router.use("/streaks", require("./streaks"));

module.exports = router;
