import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        
        let user = await authRepository.findUserByEmail(email);

        if (!user) {
          // Create dummy password since they logged in via Google
          const dummyPassword = crypto.randomBytes(32).toString('hex');
          const passwordHash = await bcrypt.hash(dummyPassword, 12);
          
          user = await authRepository.signup({
            email,
            passwordHash,
            name,
            companyName: `${name}'s Workspace`,
          });
          
          user = await authRepository.findUserById(user.id);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
