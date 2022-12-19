const passport = require('passport');
const userSch = require('./../modules/user/userSchema');
const accessTokenSch = require('./../modules/user/accessToken');
const BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(
  new BearerStrategy(async (token, done) => {
    const accessToken = await accessTokenSch.findOne({ access_token_id: token });

    if (!accessToken) {
      return done(null, false);
    }

    const user = await userSch.findOne({ _id: accessToken.user_id });

    return done(null, { authUser: user, authToken: accessToken }, { scope: 'read' });
  }),
);

module.exports = passport;
