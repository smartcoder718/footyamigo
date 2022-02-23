const { Model } = require('objection');

class Probability extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'probabilities';
  }

}

module.exports = Probability;