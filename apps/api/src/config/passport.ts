import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import { env } from "./env";
import { logger } from "../common/utils/logger";
import { authService } from "../modules/auth/auth.service";
import type { AuthResult } from "../modules/auth/auth.service";

/**
 * Registers the Google OAuth strategy (side effect — passport.use()).
 *
 * `session: false` is used everywhere this strategy is invoked, since
 * Manthan is fully stateless (JWT + DB-checked refresh tokens), not
 * cookie-session based. Passport still needs `passport.initialize()`
 * wired in app.ts, but never `passport.session()`.
 *
 * The verify callback does the actual find-or-link-or-create work via
 * authService.loginWithGoogle, then hands the full AuthResult (user +
 * tokens) to `done()` — the route's custom callback (see
 * auth.controller.ts `googleCallback`) reads it straight off `req.user`
 * for exactly one request, then it's gone (never persisted to a session).
 */
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        void (async (): Promise<void> => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              done(new Error("Google account has no public email address."));
              return;
            }

            const result: AuthResult = await authService.loginWithGoogle({
              googleId: profile.id,
              email,
              name: profile.displayName || email,
            });

            // passport's VerifyCallback type strictly expects Express.User
            // here, but we deliberately pass the full AuthResult (user +
            // tokens) through this channel instead. This is safe ONLY
            // because auth.controller.ts's googleCallback uses passport's
            // custom-callback form (`passport.authenticate("google", {...},
            // callback)`), which hands this value directly to our own
            // callback function as a plain argument — passport does NOT
            // assign it to req.user or a session in that form. Since
            // Express.User is a public extension point (also augmented by
            // auth.middleware.ts for the unrelated JWT-cookie auth flow),
            // widening it to fit AuthResult here would leak this OAuth-only
            // shape into that unrelated flow, so a scoped cast is clearer
            // than a shared type.
            done(null, result as unknown as Express.User);
          } catch (err) {
            done(err as Error);
          }
        })();
      }
    )
  );
} else {
  logger.warn(
    "Google OAuth not configured (GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET missing) — /api/v1/auth/google routes will fail until set."
  );
}

export default passport;