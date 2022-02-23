const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: { type: Number, unique: true },
    subscription: {
      status: { type: String, index: true },
      end_date: { type: Date, index: true }
    }
  },
  { strict: false }
);
const User = mongoose.model("User", UserSchema);

User.cleanDeletedUsers = async function(id, trx) {
  const SQL_User = require("../models/User");
  const Strategy = require("./Strategy");
  const users = await SQL_User.query().select("email");
  const emails = users.map(user => user.email);
  // const deleted_users = await User.deleteMany({ email: { $nin: emails } });
  console.log(await Strategy.deleteMany({ "user.email": { $nin: emails } }));
};

//
// User.cleanDeletedUsers().then(x => console.log(x));
// const  UserSQL = require("../models/User")
// UserSQL.findForMongo().then(async users=> {
//   await User.insertMany(users)
//   console.log("USERS", users)
// })
/*User.aggregate([
  {
    $match: {
      telegram: { $ne: null },
      "subscription.end_date": { $gt: new Date() },
      "subscription.status": "active"
    }
  },
  {
    $project: { telegram: 1, id: 1 }
  },

  {
    $lookup: {
      from: "strategies",
      localField: "id",
      foreignField: "user_id",
      as: "strategies",
      pipeline: [
        {
          $match: {
            type: "in-play",
            active: true,
            is_preset: 0
          }
        }
      ]
    }
  }
]).then(x => {
  console.log("X", JSON.stringify(x,null,2));
});*/
module.exports = User;
