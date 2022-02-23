const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("./user");
const isAdmin = require("@root/middlewares/isAdmin");
const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");
const moment = require("moment");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

function isLogged(req, res, next) {
  var token = req.cookies.token;
  if (!token) return next();
  jwt.verify(token, process.env.AUTHJWT, function (err, decoded) {
    if (err) return next();
    req.user = decoded;
    res.locals.user = req.user;
    return next();
  });
}

require("../controllers/auth");
require("../bots/telegram");
require("../db");

router.use(isLogged);

function genToken(body) {
  const token = jwt.sign({ user: body }, process.env.AUTHJWT, {
    expiresIn: "30d",
  });
  return token;
}

const isAuthenticated = (req, res, next) => {
  // console.log(req.user.email);
  var token = req.headers.token || req.cookies.token || req.query.token;
  if (!token) return res.status(401).send("Unauthorised");
  // console.log(
  //   "HEADERS",
  //   req.headers,
  //   "\n",
  //   "QUERY",
  //   req.query,
  //   "\n",
  //   "COOKIES",
  //   req.cookies,
  //   "\n"
  // );
  jwt.verify(token, process.env.AUTHJWT, function (err, decoded) {
    if (err) {
      return res.status(401).send("Unauthorised");
    }
    const expiry_time = moment(decoded.exp * 1000);
    const duration = moment.duration(expiry_time.diff(moment()));
    var days = duration.asDays();
    console.log(duration.asMinutes(), duration.asDays());

    if (days < 29) {
      console.log("Refrshing token");
      // refresh_token = genRefreshToken(body);
      token = genToken(decoded.user);
      const domain = process.env.DOMAIN || "dashboard.footyamigo.com";
      // res.cookie("refresh_token", refresh_token, {
      //   maxAge: 1000 * 60 * 60 * 24,
      //   httpOnly: true,
      //   domain,
      // });

      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        domain,
      });
    }
    // console.log(decoded, "USER");
    req.user = decoded;
    return next();
  });
};

// router.use("/rest", require("./rest"));
router.use("/user", isAuthenticated, user);
// router.use("/admins", require("./admins"));
// router.use("/direct", user);

router.use("/admin", isAdmin, require("./admin"));
router.use("/auth", require("./auth"));

module.exports = router;
