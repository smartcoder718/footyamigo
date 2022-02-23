const express = require("express");
const router = express.Router();
const { User, LocalCountry } = require("@root/db");
// const Flutterwave = require("flutterwave-node-v3");
const uuid = require("uuid");
const axios = require("axios");
// const flw = new Flutterwave(
//   process.env.FLUTTERWAVE_PUBLIC_KEY,
//   process.env.FLUTTERWAVE_SECRET_KEY
// );

router.get("/buy-pro", async (req, res) => {
  try {
    const { country_id } = req.query;
    const domain = req.protocol + "://" + req.hostname;
    const user = await User.findById(req.user.user.id);
    const country = await LocalCountry.findById(country_id);
    const chargeData = {
      tx_ref: uuid.v4(),
      amount: country.pro_price,
      currency: country.currency,
      //country: country.currency.slice(0,2),
      //payment_options: " ",
      // specified redirect URL
      redirect_url: domain + "/payment",
      //cancel_url: domain + "/profile"
      meta: {
        user_id: user.id,
        plan_id: process.env.PADDLE_PRO_ID || 1
      },
      customer: {
        email: user.email,
        //phone_number: "08102909304",
        name: user.firstname + " " + user.lastname,
        user_id: user.id
      },
      customizations: {
        title: "FootyAmigo Pro Subscription",
        description:
          "Upgrade to Pro and join the thousands of smart and profitable football bettors",
        logo: "https://i.imgur.com/n40vm2u.png"
      }
    };
    const { data: charge } = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      chargeData,
      {
        headers: {
          Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY
        }
      }
    );
    res.send(charge.data.link);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
