const express = require("express");
const router = express.Router();
const { Transaction, User, Plan } = require("@root/db");

async function createCharge(data) {
  const {
    txRef: checkout_id,
    id: subscription_id,
    orderRef: payment_id,
    customer: { email },
    createdAt: created_at,
    amount,
    currency,
    "event.type": payment_method
  } = data;
  const plan_id = process.env.PRO_PLAN_ID || 1;
  const plan = await Plan.findById(plan_id || 1);

  await Transaction.create({
    checkout_id,
    order_id: checkout_id,
    // subscription_id,
    email,
    amount,
    currency,
    plan_id,
    payment_id,
    payment_method,
    amount_usd: plan.price,
    status: "pending",
    gateway: "flutterwave",
    created_at
  });

  await User.issueSubByAdmin({ email, plan_id, order_id: checkout_id });
}

// Webhook request handling
router.post("/", async (req, res) => {
  if (validateWebhook(req)) {
    const data = req.body;
    console.log(req.body);
    if (data.status == "successful") {
      await createCharge(data);
    } else {
      console.log(req.body);
    }
    console.log("WEBHOOK_VERIFIED");
    res.status(200).end();
  } else {
    res.sendStatus(403);
    console.log("WEBHOOK_NOT_VERIFIED");
  }
});

function validateWebhook(req) {
  var hash = req.headers["verif-hash"];
  const secret_hash = process.env.FLUTTERWAVE_SECRET_HASH;
  if (!hash || hash != secret_hash) {
    return false;
  }
  return true;
}
module.exports = router;
