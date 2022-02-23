const { User } = require("@root/db");

const isSubscribed = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: "unauthenticated" });
  }
  const user = await User.findById(req.user.user.id);
  if (user.subscription) {
    req.user.is_trial = user.subscription.trial;
    return next();
  } else {
    return res.status(401).send({ message: "user has no subscription" });
  }
};
module.exports = isSubscribed;
