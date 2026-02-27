import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import env from "./env.js";
import User from "../modules/user/user.model.js";

const GOOGLE_CLIENT_ID: string = env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET: string = env.GOOGLE_CLIENT_SECRET as string;
const SERVER_URL: string = env.SERVER_URL as string;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SERVER_URL) {
  throw new Error("Google OAuth environment variables are missing");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/api/auth/google/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"), undefined);
        }

        // 1️⃣ Try provider match
        let user = await User.findOne({
          authProvider: "google",
          providerId: profile.id,
        });

        // 2️⃣ Fallback to email match
        if (!user) {
          user = await User.findOne({ email });
        }

        if (user) {
          // Update provider info if needed
          if (user.authProvider !== "google") {
            user.authProvider = "google";
            user.providerId = profile.id;
            user.isEmailVerified = true;
            await user.save();
          }

          return done(null, user);
        }

        // 3️⃣ Create new user
        const newUser = await User.create({
          email,
          displayName: profile.displayName ?? email.split("@")[0],
          authProvider: "google",
          providerId: profile.id,
          avatar: profile.photos?.[0]?.value ?? null,
          isEmailVerified: true,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

export default passport;
