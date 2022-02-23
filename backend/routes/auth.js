const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const admin = require("firebase-admin");
const moment = require("moment");
const { User } = require("@root/db");

const { sendTemplateEmail } = require("@root/mailers");
require("../controllers/auth");
const { AccountActivationCode } = require("@root/db");

const { body, validationResult } = require("express-validator");
// username must be an email

// password must be at least 5 chars long
function genToken(body) {
  const token = jwt.sign({ user: body }, process.env.AUTHJWT, {
    expiresIn: "30d",
  });
  return token;
}

router.post(
  "/signup",
  body("firstname").isAlpha().isLength({ min: 3, max: 20 }),
  body("lastname").isAlpha().isLength({ min: 3, max: 20 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res, next) => {
    const { email, code, firstname } = req.body;
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();
    if (hasErrors) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid Code", errors: result });
    }
    if (!code) {
      await AccountActivationCode.create({ email, name: firstname });
      return res.send({ success: true, message: "Code sent to email" });
    } else {
      const validation = await AccountActivationCode.validate({
        email,
        code,
      });
      console.log("VALIDATION", validation);
      if (!validation) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid Code" });
      }
    }
    passport.authenticate("signup", { session: false }, async (error, user) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send("There was a problem registering the user.");
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { id: user.id, email: user.email };
        const token = genToken(body)
        const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
        // maxAge: 1000 * 60 * 60 * 24 * 3
        return res
          .cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            domain,
          })
          .send({ token });
      });
    })(req, res, next);
  }
);



router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err) {
          console.log(err);
          return res.status(401).send("Login failed. Server error occured.");
        }
        if (!user) {
          console.log("USER NOT FOUND");
          return res.status(401).send("Login failed. Invalid credentials.");
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          try {
            const body = {
              id: user.id,
              email: user.email,
              subscription: user.subscription,
            };
            // const refresh_token = genRefreshToken(body);
            const token = genToken(body);
            console.log(user);
            if (req.headers["token-mode"] == "1") {
              const uid = user.id + "";
              const firebaseUser = admin.firestore().collection("users");
              const user_doc = await firebaseUser.doc(uid).get();
              const revoke_time = Math.floor(Date.now() / 1000);
              if (user_doc.exists) {
                await admin.auth().revokeRefreshTokens(uid);
                await firebaseUser.doc(uid).update({
                  revoke_time,
                  message_token: req.body.message_token,
                });
              } else {
                await firebaseUser.doc(uid).set({
                  revoke_time,
                  last_alert_seen: moment().unix(),
                  message_token: req.body.message_token,
                });
              }
              const firebaseCustomToken = await admin
                .auth()
                .createCustomToken(uid);
              console.log("Login success:", firebaseCustomToken);

              return res.json({
                token,
                firebaseCustomToken,
                revoke_time,
              });
            } else {
              const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
              // res.cookie("refresh_token", refresh_token, {
              //   maxAge: 1000 * 60 * 60 * 24,
              //   httpOnly: true,
              //   domain,
              // });
              return res
                .cookie("token", token, {
                  maxAge: 1000 * 60 * 60 * 24 * 30,
                  httpOnly: true,
                  domain,
                })
                .send({ token });
            }
          } catch (error) {
            console.log(error);
            return res.send({
              success: false,
              message: "Server error occured",
            });
          }
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }
);

// router.post("/refresh", async function (req, res) {
//   try {
//     var token = req.cookies.refresh_token || req.headers.refresh_token;
//     // console.log(req.user.email);
//     if (!token) return res.status(401).send("Unauthorised");
//     jwt.verify(token, process.env.AUTHJWT, function (err, user) {
//       if (err) return res.status(401).send(err);
//       req.user = user;
//       const body = {
//         id: user.id,
//         email: user.email,
//         subscription: user.subscription,
//       };
//       const refresh_token = genRefreshToken(body);
//       token = genToken(body);
//       const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
//       res.cookie("refresh_token", refresh_token, {
//         maxAge: 1000 * 60 * 60 * 24,
//         httpOnly: true,
//         domain,
//       });
//       return res
//         .cookie("token", token, {
//           maxAge: 1000 * 60,
//           httpOnly: true,
//           domain,
//         })
//         .send({ token, refresh_token });
//     });

//     //res.send({ success: false, message: "Token issued", activation_token })
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .send({ success: false, message: "Interval server error occured" });
//   }
// });

router.post("/send-reset-link", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    const user = await User.findByEmail(email);
    const token = jwt.sign(
      { email: user.email, hash: user.password },
      process.env.AUTHJWT,
      { expiresIn: "15 mins" }
    );
    const resetLink =
      (process.env.BASE_URL || "https://dashboard.footyamigo.com") +
      "/auth/change-password?token=" +
      token;
    await sendTemplateEmail({
      receiverEmail: user.email,
      Template: "FORGOT_PASSWORD",
      TemplateData: { name: user.firstname, resetLink },
    });
    res.send({ success: true, messsage: "Success" });
    //res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

router.get("/logout", async (req, res, next) => {
  const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
  return res
    .clearCookie("token", {
      domain,
    })
    .send({ success: true });
});

router.post("/change-password", async (req, res) => {
  try {
    const { password, token } = req.body;

    const { email, hash: oldpassword } = jwt.verify(token, process.env.AUTHJWT);
    await User.changePassword(email, oldpassword, password);

    res.send({ success: true, messsage: "Password Changed" });
    //res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: error });
  }
});

module.exports = router;
