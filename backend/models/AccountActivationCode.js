const { Model } = require("objection");
const moment = require("moment");
const { sendTemplateEmail } = require("@root/mailers");

class AccountActivationCode extends Model {
  static get tableName() {
    return "account_activation_codes";
  }
  /* static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const User = require("./User");
    return {
      email: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "account_activation_codes.email",
          to: "users.id"
        }
      }
    };
  }*/
}

AccountActivationCode.validate = function({ email, code }) {
  console.log(email, code, "LAORA");
  return this.query()
    .findOne({
      email,
      code
    })
    .where("expires_at", ">", new Date());
};

function genCode() {
  return ("" + Math.random()).substring(2, 8);
}
AccountActivationCode.create = async function({ email, name }) {
  const code = genCode();
  const expires_at = moment()
    .add(15, "minutes")
    .toDate();
  
  const activation = await this.query().insert({
    email,
    code,
    expires_at
  });
  const mail = await sendTemplateEmail({
    receiverEmail: email,
    Template: "ACCOUNT_ACTIVATION",
    TemplateData: { name, code }
  });
  console.log(mail);
  return activation;
};

module.exports = AccountActivationCode;
