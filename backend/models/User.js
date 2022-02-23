const { Model } = require("objection");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { sendTemplateEmail } = require("@root/mailers");
const { sendySubscribe, sendyUnsubscribe } = require("@root/mailers/sendy");

class User extends Model {
  static get tableName() {
    return "users";
  }

  $beforeInsert() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }
  static modifiers = {
    withSub(query) {
      query
        .withGraphFetched("subscription(withPlan, withDetails)")
        .select(
          "id",
          "email",
          "firstname",
          "lastname",
          "utcoffset",
          "seen_intro",
          "locale",
          "telegram",
          "phone",
          "created_at",
          "updated_at"
        );
    },
  };

  static get relationMappings() {
    const Strategy = require("./Strategy");
    const Subscription = require("./Subscription");
    const Transaction = require("./Transaction");
    return {
      strategies: {
        relation: Model.HasManyRelation,
        modelClass: Strategy,
        join: {
          from: "users.id",
          to: "strategies.user_id",
        },
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: Transaction,
        join: {
          from: "users.id",
          to: "transactions.user_id",
        },
      },
      subscription: {
        relation: Model.HasOneRelation,
        modelClass: Subscription,
        join: {
          from: "users.email",
          to: "subscriptions.email",
        },
        filter(builder) {
          builder
            //.where("subscriptions.status", "active")
            .where("end_date", ">", new Date());
        },
      },
    };
  }
}

User.prototype.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

User.findTelegramIds = async function (role) {
  const query = this.query()
    .select("users.telegram", "users.firstname", "users.id")
    .whereNotNull("telegram")
    .whereNull("phone");
  switch (role) {
    case "pro":
      query.rightJoinRelated("subscription").where("subscription.plan_id", 1);
      break;
    case "trial":
      query.rightJoinRelated("subscription").where("subscription.plan_id", 2);
      break;
    case "free":
      query.leftJoinRelated("subscription").whereNull("subscription.plan_id");
      break;
    default:
      break;
  }
  const users = await query;
  return users;
};

User.findAppUsers = async function (role) {
  const query = this.query()
    .select("users.phone", "users.firstname", "users.id")
    .whereNotNull("phone");
  switch (role) {
    case "pro":
      query.rightJoinRelated("subscription").where("subscription.plan_id", 1);
      break;
    case "trial":
      query.rightJoinRelated("subscription").where("subscription.plan_id", 2);
      break;
    case "free":
      query.leftJoinRelated("subscription").whereNull("subscription.plan_id");
      break;
    default:
      break;
  }
  const users = await query;
  return users;
};

User.findById = function (id, trx) {
  return this.query(trx)
    .withGraphFetched("subscription(withPlan, withDetails)")
    .findById(id);
};

User.findByEmail = function (email) {
  return this.query()
    .findOne({
      email,
    })
    .withGraphFetched("subscription(withPlan, withDetails)");
};

User.findActiveIds = function () {
  return this.query().whereNotNull("telegram").pluck("id");
};

User.syncWithMongo = async function (id, trx) {
  const MongoUser = require("../mongomodels/User");
  const data = await User.findById(id, trx);
  await MongoUser.findOneAndUpdate(
    { id },
    { $set: data },
    {
      upsert: true,
    }
  );
  return data;
};

User.syncAllUsers = async function () {
  User.query()
    .select("id")
    .then(async (users) => {
      ids = users.map((user) => user.id);
      for (var id of ids) {
        const data = await User.syncWithMongo(id);
        console.log(data);
      }
    });
};
// User.syncAllUsers().then((x) => console.log(x));

User.setTelegramToken = function (user_id, chat_id) {
  const FreeTrial = require("./FreeTrial");
  return this.transaction(async (trx) => {
    await this.query(trx).findById(user_id).patch({
      telegram: chat_id,
    });
    const trial = await FreeTrial.query().findOne({ chat_id });
    if (!trial) {
      await FreeTrial.query(trx).insert({ chat_id, user_id });
    }
    await User.syncWithMongo(user_id, trx);
  });
};
User.updateProfile = async function (
  user_id,
  { firstname, lastname, avatar_id }
) {
  await this.query()
    .findById(user_id)
    .patch({ firstname, lastname, avatar_id });
  return await User.syncWithMongo(user_id);
};
User.changePassword = async function (email, oldpassword, newpassword) {
  const user = await this.query().findOne({ email, password: oldpassword });
  const password = bcrypt.hashSync(newpassword, 10);
  await user.$query().patchAndFetch({ password });
  return await User.syncWithMongo(user.id);
};

User.updatePassword = async function (user_id, password) {
  password = bcrypt.hashSync(password, 10);
  await this.query().findById(user_id).patch({ password });
  return await User.syncWithMongo(user_id);
};

User.delTelegram = async function (user_id) {
  await this.query().findById(user_id).patch({
    telegram: null,
  });
  return await User.syncWithMongo(user_id);
};

User.doNotShowIntro = async function (user_id) {
  await this.query().findById(user_id).patch({
    seen_intro: true,
  });
  return await User.syncWithMongo(user_id);
};

User.create = function (user_data) {
  return this.transaction(async (trx) => {
    const user = await User.query(trx).insert(user_data);
    const Plan = require("./Plan");
    const plan = await Plan.query().findById(2);
    const subscription = await user.$relatedQuery("subscription", trx).insert({
      plan_id: plan.id,
      email: user.email,
      start_date: moment().toDate(),
      end_date: moment().add(plan.days, "days").toDate(),
      status: "active",
    });
    await sendySubscribe({
      email: user.email,
      name: user.firstname,
      list: process.env.SENDY_7_DAY_LIST_ID,
    });
    await sendySubscribe({
      email: user.email,
      name: user.firstname,
      list: process.env.SENDY_8_DAY_LIST_ID,
    });
    await sendTemplateEmail({
      receiverEmail: user.email,
      Template: "WELCOME",
      TemplateData: { name: user.firstname },
    });

    return await User.syncWithMongo(user.id, trx);
  });
};

User.findForAdmin = function () {
  return this.query()
    .withGraphFetched("subscription(withPlan)")
    .select("id", "email", "firstname", "lastname", "created_at", "telegram");
};

//console.log("END DATE", moment("2021-10-11", "YYYY-MM-DD").endOf("day"))

User.issueSubByAdmin = function ({
  email,
  plan_id,
  order_id,
  start_date,
  end_date,
  subscription_id,
}) {
  return this.transaction(async (trx) => {
    const user = await User.query().findOne({ email });
    const Plan = require("./Plan");
    const Subscription = require("./Subscription");
    const plan = await Plan.query().findById(plan_id);
    await Subscription.query(trx)
      .where({ email })
      // .whereNotNull("id")
      .delete();
    const subscription = await user.$relatedQuery("subscription", trx).insert({
      //user_id: user.id,
      plan_id: plan.id,
      email: user.email,
      order_id,
      subscription_id,
      start_date: start_date || moment().toDate(),
      end_date: end_date
        ? moment(end_date).endOf("day").subtract(1, "minute").toDate()
        : moment().add(plan.days, "days").toDate(),
      status: "active",
    });
    if (order_id) {
      const Transaction = require("./Transaction");
      await Transaction.query(trx)
        .update({ status: "success" })
        .where({ order_id });
    }
    if (!plan.trial) {
      await sendySubscribe({
        email: user.email,
        name: user.firstname,
        list: process.env.SENDY_PRO_LIST_ID,
      });
      await sendyUnsubscribe({
        email: user.email,
        list: process.env.SENDY_8_DAY_LIST_ID,
      });
    }
    // return subscription;
    return await User.syncWithMongo(user.id, trx);
  });
};

User.updateExpiryByAdmin = function ({ email, end_date }) {
  return this.transaction(async (trx) => {
    const user = await User.query().findOne({ email });
    end_date = moment.utc(end_date).toDate();
    await user.$relatedQuery("subscription", trx).update({
      end_date,
    });

    return await User.syncWithMongo(user.id, trx);
  });
};

User.deleteSubByAdmin = function ({ email }) {
  return this.transaction(async (trx) => {
    const user = await User.query().findOne({ email });
    const Subscription = require("./Subscription");
    await Subscription.query(trx)
      .where({ email })
      // .whereNotNull("id")
      .delete();

    // return subscription;
    return await User.syncWithMongo(user.id, trx);
  });
};

// User.findForMongo = function() {
//   return this.query()
//     .withGraphFetched("subscription(withPlan)")
//     .select("*");
// };

module.exports = User;
