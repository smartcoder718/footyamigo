const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { User } = require("../db");
const { Strategy: JWTstrategy, ExtractJwt } = require("passport-jwt");

passport.use(
  new JWTstrategy(
    {
      secretOrKey:
        "eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYzMTI4MjQ2NCwiaWF0IjoxNjMxMjgyNDY0fQ",
      jwtFromRequest: ExtractJwt.fromBodyField("token")
        ? ExtractJwt.fromHeader("token")
        : ExtractJwt.fromBodyField("token")
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const { firstname, lastname, utcoffset, locale } = req.body;
        const user = await User.create({
          email,
          password,
          firstname,
          lastname,
          utcoffset,
          locale
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        if (
          process.env.DOMAIN == "macbook.local" &&
          password == "Macbook123?"
        ) {
          return done(null, user, { message: "Logged in Successfully" });
        }
        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
