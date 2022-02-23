const { User } = require('../../../db')
async function getUser(req) {
  var UserId = req.user.user.id
  var user = await User.findById(UserId)
  return user
}

module.exports = {
  getUser
};