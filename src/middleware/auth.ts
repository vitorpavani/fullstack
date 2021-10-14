import bcrypt from 'bcrypt';
import passport from 'passport';

// Passport Setup
import * as passportLocal from 'passport-local';
import * as passportJwt from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/User';


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
// Options for Jwt Strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
  ignoreExpiration: true,
};



// Passport 
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (username: string, password: string, done) => {
    User.findOne({ email: username })
      .then((found) => {
        if (found === null) {
          done(null, false, { message: 'Invalid Credentials' });
        } else if (!found.password) {
          done(null, false, { message: 'Invalid Credentials' });
        } else if (!bcrypt.compareSync(password, found.password)) {
          done(null, false, { message: 'Invalid Credentials' });
        } else {
          done(null, found);
        }
      })
      .catch((err) => {
        
        console.error(err.message);
        done(err, false);
      });
  })
);

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    // Check token expiration time
    const expTime = payload.exp; // UTC in seconds
    const currentTime = Date.now().valueOf() / 1000; // Converted from milliseconds to seconds, UTC
    if (expTime) {
      // console.log(`exp: ${expTime} currentTime: ${currentTime}`);
      if (expTime < currentTime) {
        payload.user.expired = true;
        // console.log(payload.user);
        return done(null, payload.user);
      }
    }

    User.findOne({ _id: payload._id })
      .select('-password')
      .then((found) => {
        if (found) {
          return done(null, found);
        }
        return done(null, false);
      })
      .catch((err) => {
        console.error(err.message);
        done(err, false);
      });
  })
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((id: string, done) => {
  User.findById(id)
    .then((dbUser: any) => {
      done(null, dbUser);
    })
    .catch((err) => {
      console.error(err.message);
      done(err);
    });
});


export default passport;

