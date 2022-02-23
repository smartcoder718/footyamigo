const express = require("express");
const router = express.Router();
const { User, Plan } = require("@root/db");
const coinbase = require("coinbase-commerce-node");
const Client = coinbase.Client;
const clientObj = Client.init("bb5dc5a8-fe39-4200-a267-bde313bbee1e");
clientObj.setRequestTimeout(3000);
const Charge = coinbase.resources.Charge;

router.get("/buy-pro", async (req, res) => {
  try {
    const domain = req.protocol + "://" + req.hostname;
    const user = await User.findById(req.user.user.id);
    const plan_id = process.env.PRO_PLAN_ID || 1;
    const plan = await Plan.findById(plan_id);
    const chargeData = {
      name: "FootyAmigo Pro Subscription",
      description:
        "Upgrade to Pro and join the thousands of smart and profitable football bettors",
      local_price: {
        amount: plan.price,
        currency: "GBP"
      },
      pricing_type: "fixed_price",
      metadata: {
        user_id: user.id,
        email: user.email,
        plan_id
      },
      redirect_url: domain + "/payment/success",
      cancel_url: domain + "/profile"
    };
    const charge = await Charge.create(chargeData);
    res.send(charge.hosted_url);
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: true, message: "Internal server error" });
  }
});

module.exports = router;
