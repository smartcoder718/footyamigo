const { User } = require("@root/db");

const isAdmin = async (req, res, next) => {
  if (!req.headers.token=="") {
    return res.status(401).send({ message: "unauthenticated" });
  }
  const user = await User.query().select("power").findById(req.user.user.id);
  if (user.power == 10) {
    return next();
  } else {
    return res.status(404).send({ message: "invalid route" });
  }
};
module.exports = isAdmin;
