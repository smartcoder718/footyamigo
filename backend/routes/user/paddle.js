const express = require("express");
const router = express.Router();
const { User } = require("@root/db");
const PaddleSDK = require("paddle-sdk");
const client = new PaddleSDK(
  process.env.PADDLE_VENDOR_ID,
  process.env.PADDLE_API_KEY,
  process.env.PADDLE_PUBLIC_KEY,
  {
    server:
      process.env.PADDLE_TEST == 1
        ? "https://sandbox-vendors.paddle.com/api/2.0"
        : "https://vendors.paddle.com/api/2.0"
  }
);

router.get("/buy-pro", async (req, res) => {
  try {
    const domain = req.protocol + "://" + req.hostname;
    const user = await User.findById(req.user.user.id);
    const chargeData = {
      //title: "FootyAmigo Pro Subscription",
      product_id: process.env.PADDLE_PRO_ID,
      custom_message:
        "Upgrade to Pro and join the thousands of smart and profitable football bettors",
      customer_email: user.email,
      passthrough: JSON.stringify({
        plan_id: process.env.PRO_PLAN_ID
      }),
      return_url: domain + "/payment/success",
      cancel_url: domain + "/profile"
    };
    const charge = await client.generatePayLink(chargeData);
    res.send({ payment_url: charge.url, vendor: process.env.PADDLE_VENDOR_ID });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
