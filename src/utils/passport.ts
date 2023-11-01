import passport, { DeserializeUserFunction, DoneCallback } from 'passport';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import { db } from './db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: 'http://localhost:3001/auth/google/callback',
      passReqToCallback: true,
    },
    async function (
      req: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: DoneCallback
    ) {
      try {
        let dbUser = await db.users.findUnique({
          where: {
            googleId: profile.id,
          },
        });

        if (!dbUser) {
          dbUser = await db.users.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
              googleId: profile.id,
            },
          });
        }
        if (dbUser) return cb(null, dbUser);
      } catch (error) {
        console.log('[GOOGLE_SIGN_IN]', error);
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser(function (user: any, cb: DoneCallback) {
  console.log('[SERIALIZE_USER]', user);
  cb(null, user.id);
});

passport.deserializeUser(async function (id: any, cb: DoneCallback) {
  const user = await db.users.findUnique({
    where: {
      id,
    },
  });

  if (!user) return cb(new Error('User not found'), null);

  console.log('[DESERIALIZE_USER]', user);
  return cb(null, user);
});

export default passport;
