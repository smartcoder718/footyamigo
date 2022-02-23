const { Model } = require("objection");
const crypto = require("crypto");
const base64url = require("base64url");

function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

class TelegramToken extends Model {
  static get tableName() {
    return "telegram_tokens";
  }
}

TelegramToken.findUserToken = function(user_id) {
  return this.query().findOne({ user_id });
};

TelegramToken.generateToken = function(user_id) {
  return this.query().insert({
    user_id,
    activation_token: randomStringAsBase64Url(36)
  });
};

TelegramToken.findUserByToken = function(activation_token) {
  return this.query().findOne({ activation_token });
};

TelegramToken.deleteUserToken = function(activation_token) {
  return this.query()
    .delete()
    .where({ activation_token });
};

module.exports = TelegramToken;
