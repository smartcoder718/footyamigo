const express = require("express");
const router = express.Router();
const moment = require("moment");
// Node.js & Express implementation
const crypto = require("crypto");
const Serialize = require("php-serialize");
const {
  Transaction,
  User,
  Plan,
  Subscription,
  SubscriptionDetail,
} = require("@root/db");

async function createCharge(data) {
  console.log(data);
  const {
    order_id,
    checkout_id,
    subscription_payment_id: payment_id,
    subscription_id,
    email,
    unit_price: amount,
    currency,
    receipt_url,
    payment_method,
    passthrough: { plan_id },
    event_time: created_at,
  } = data;
  const plan = await Plan.findById(plan_id);
  return await Transaction.create({
    order_id,
    checkout_id,
    payment_id,
    subscription_id,
    email,
    amount,
    receipt_url,
    amount_usd: plan.price,
    currency,
    payment_method,
    status: "pending",
    plan_id,
    gateway: "paddle",
    created_at,
  });
}

async function resolveCharge(data) {
  var {
    email,
    next_bill_date: end_date,
    passthrough: { plan_id },
    event_time: start_date,
    order_id,
    subscription_id,
  } = data;
  start_date = moment(start_date).toDate();
  end_date = moment(end_date, "YYYY-MM-DD").toDate();
  /*await Transaction.update(order_id, {
    receipt_url,
    payment_method,
    status: "success"
  });*/
  await User.issueSubByAdmin({
    email,
    plan_id,
    order_id,
    start_date,
    subscription_id,
    end_date,
  });
}

// Webhook request handling
router.post("/", async (req, res) => {
  if (validateWebhook(req.body)) {
    const { order_id, alert_name, subscription_id } = req.body;
    if (req.body.passthrough) {
      req.body.passthrough = JSON.parse(req.body.passthrough);
    } else {
      req.body.passthrough = { plan_id: 1 };
    }
    //JUST FOR TEST
    console.log("JUST TEST", req.body);
    switch (alert_name) {
      case "subscription_created":
        const { update_url, cancel_url, user_id: platform_user_id } = req.body;

        await SubscriptionDetail.create({
          update_url,
          cancel_url,
          platform_user_id,
          subscription_id,
          gateway: "paddle",
        });
        break;
      case "subscription_updated":
        break;
      case "subscription_cancelled":
        await SubscriptionDetail.cancel(subscription_id);
        break;
      case "subscription_payment_failed":
        await Transaction.update(order_id, { status: "failed" });
        break;
      case "subscription_payment_refunded":
        await Transaction.update(order_id, { status: "refunded" });
        break;
      case "subscription_payment_succeeded":
        await createCharge(req.body);
        await resolveCharge(req.body);
        break;
      default:
        console.log(req.body);
        break;
    }
    console.log("WEBHOOK_VERIFIED");
    res.status(200).end();
  } else {
    console.log("WEBHOOK_NOT_VERIFIED", req.body);
    res.sendStatus(403);
  }
});

function ksort(obj) {
  const keys = Object.keys(obj).sort();
  let sortedObj = {};
  for (let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]];
  }
  return sortedObj;
}

function validateWebhook(jsonObj) {
  // Grab p_signature
  const mySig = Buffer.from(jsonObj.p_signature, "base64");
  // Remove p_signature from object - not included in array of fields used in verification.
  delete jsonObj.p_signature;
  // Need to sort array by key in ascending order
  jsonObj = ksort(jsonObj);
  for (let property in jsonObj) {
    if (
      jsonObj.hasOwnProperty(property) &&
      typeof jsonObj[property] !== "string"
    ) {
      if (Array.isArray(jsonObj[property])) {
        // is it an array
        jsonObj[property] = jsonObj[property].toString();
      } else {
        //if its not an array and not a string, then it is a JSON obj
        jsonObj[property] = JSON.stringify(jsonObj[property]);
      }
    }
  }
  // Serialise remaining fields of jsonObj
  const serialized = Serialize.serialize(jsonObj);
  // verify the serialized array against the signature using SHA1 with your public key.
  const verifier = crypto.createVerify("sha1");
  verifier.update(serialized);
  verifier.end();

  const verification = verifier.verify(process.env.PADDLE_PUBLIC_KEY, mySig);
  // Used in response if statement
  return verification;
}
module.exports = router;
