const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const db = require("../../models");

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  "jwt",
  new JWTStrategy(options, async (payload, done) => {
    const user = await db.Maker.findOne({ where: { id: payload.id } });

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);

const options1 = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_FOR_ADMIN,
};

passport.use(
  "jwt-admin",
  new JWTStrategy(options1, async (payload, done) => {
    const user = await db.Admin.findOne({ where: { id: payload.id } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
);
