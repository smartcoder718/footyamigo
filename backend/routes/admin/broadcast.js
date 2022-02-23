const express = require("express");
const router = express.Router();
const { Broadcast, User } = require("@root/db");
const telegram = require("@bots/telegram");
const admin = require("firebase-admin");
const uuid = require("uuid");
const moment = require("moment");
const firebaseAlerts = admin.firestore().collection("alerts");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/send", async (req, res) => {
  try {
    console.log(req.body);
    await Broadcast.create(req.body);
    if (req.body.platform == "telegram") {
      const users = await User.findTelegramIds(req.body.audience);
      sendBroadcast(req.body, users);
    } else {
      const users = await User.findAppUsers(req.body.audience);
      sendAppBroadcast(req.body, users);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, messsage: "error" });
  }
});

async function retryUntilSucceed(id, message) {
  try {
    await telegram.sendMessage(id, message, {
      parse_mode: "html",
    });
    return true;
  } catch (err) {
    if (
      err.response &&
      err.response.body &&
      err.response.body.error_code == 403
    ) {
      // console.log("blocked");
      return true;
    }

    return false;
  }
}
console.log(moment.utc().unix(), moment().unix())
async function sendAppBroadcast({ title, message }, users) {
  console.log("sending broadcast to", users.length, "users");

  const retries = [];
  for (var user of users) {
    var user_message = `<b>${title}</b>\n${message}`;
    user_message = user_message.replace("[Name]", user.firstname);
    try {
      await firebaseAlerts.doc(uuid.v4()).set({
        type: "broadcast",
        user_id: "" + user.id,
        sending_time: moment().unix(),
        message: user_message,
      });
    } catch (err) {
      console.log(err);
      retries.push(user);
      delay(4000);
    }
    // console.log(user);
  }
  if (retries.length) {
    await sendAppBroadcast({ title, message }, retries);
  }
  return users;
}
async function sendBroadcast({ title, message }, users) {
  console.log("sending broadcast to", users.length, "users");

  const retries = [];
  for (var user of users) {
    var user_message = `<b>${title}</b>\n${message}`;
    user_message = user_message.replace("[Name]", user.firstname);
    const success = await retryUntilSucceed(user.telegram, user_message);
    if (!success) {
      retries.push(user);
      delay(4000);
    }
    // console.log(user);
  }
  if (retries.length) {
    await sendBroadcast({ title, message }, retries);
  }
  return users;
}
// User.findTelegramIds("pro").then((users) => {
//   sendBroadcast({ title: 1, message: 2, audience: "pro" }, users).then((x) =>
//     console.log(x)
//   );
// });

module.exports = router;
