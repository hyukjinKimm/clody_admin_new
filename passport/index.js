const passport = require('passport');
const local = require('./localStrategy');

module.exports = () => {
  passport.serializeUser((admin, done) => {
    done(null, admin);
  });
  passport.deserializeUser((admin, done) => {
    done(null, admin)
  });
  local();
};