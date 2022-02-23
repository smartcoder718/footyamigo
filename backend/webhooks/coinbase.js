const express = require("express");
const router = express.Router();
const { Webhook } = require("coinbase-commerce-node");
const webhookSecret = process.env.COINBASEWEBHOOKSECRET;
const { Transaction, User, Plan } = require("@root/db");

async function createCharge(data) {
  const {
    pricing: {
      local: { amount, currency }
    },
    hosted_url: receipt_url,
    id: checkout_id,
    metadata: { user_id, email, plan_id },
    created_at
  } = data;
  const plan = await Plan.findById(plan_id);
  var payment_method;
  try {
    payment_method = data.payments[data.payments.length].network;
  } catch (error) {
    console.log(error);
  }
  return Transaction.create({
    amount,
    currency,
    payment_method,
    receipt_url,
    gateway: "coinbase",
    email,
    plan_id,
    amount_usd: plan.price,
    order_id: checkout_id,
    checkout_id: checkout_id,
    status: "pending",
    created_at
  });
}

async function resolveCharge(data) {
  const { email, plan_id } = data.metadata;
  // const plan_id = process.env.PRO_PLAN_ID || 1;
  const checkout_id = data.id;
  await User.issueSubByAdmin({ email, plan_id, order_id: checkout_id });
}

router.post("/", async (req, res) => {
  var event;

  //console.log(req.headers);
  //console.log(req.rawBody, "RAW BODY");
  try {
    event = Webhook.verifyEventBody(
      req.rawBody,
      req.headers["x-cc-webhook-signature"],
      webhookSecret
    );
    console.log(event);
    const { type, data } = event;
    //JUST FOR TEST
    if (!data.metadata.email) {
      data.metadata = {
        user_id: 1,
        email: "vishalbty@gmail.com"
      };
    }

    switch (type) {
      case "charge:created":
        break;
      case "charge:failed":
        await Transaction.updateStatus(data.id, "failed");
        break;
      case "charge:delayed":
        await Transaction.updateStatus(data.id, "delayed");
        break;
      case "charge:pending":
        await Transaction.updateStatus(data.id, "pending");
        break;
      case "charge:confirmed":
        await createCharge(data);
        await resolveCharge(data);
        break;
      default:
        console.log(event);
        break;
    }
  } catch (error) {
    console.log("Error occured", error.message);

    return res.status(400).send("Webhook Error:" + error.message);
  }

  console.log("Success", event.id);

  res.status(200).send("Signed Webhook Received: " + event.id);
});

module.exports = router;
