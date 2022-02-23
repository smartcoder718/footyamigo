const { Model } = require("objection");

class FreeTrial extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "free_trials";
  }
  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    return {};
  }
}

FreeTrial.findByChatId = function(chat_id) {
  return this.query().findOne({ chat_id });
};

module.exports = FreeTrial;
