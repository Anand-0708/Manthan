import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { env } from "../../config/env";
import { clearAuthCookies, REFRESH_COOKIE_NAME, setAuthCookies } from "../../common/utils/cookies";
import { issueCsrfToken } from "../../common/middleware/csrf.middleware";
import { sendSuccess } from "../../common/utils/apiResponse";
import { authService, type AuthResult } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.validators";

export const authController = {
  csrfToken(req: Request, res: Response): void {
    const token = issueCsrfToken(req, res);
    sendSuccess(res, { csrfToken: token });
  },

  async register(req: Request, res: Response): Promise<void> {
    const body = req.body as RegisterInput;
    const { user, accessToken, refreshToken } = await authService.register(body);
    setAuthCookies(res, { accessToken, refreshToken });
    sendSuccess(res, { user }, 201);
  },

  async login(req: Request, res: Response): Promise<void> {
    const body = req.body as LoginInput;
    const { user, accessToken, refreshToken } = await authService.login(body);
    setAuthCookies(res, { accessToken, refreshToken });
    sendSuccess(res, { user });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    const { accessToken, refreshToken } = await authService.refresh(rawRefreshToken ?? "");
    setAuthCookies(res, { accessToken, refreshToken });
    sendSuccess(res, { success: true });
  },

  async logout(req: Request, res: Response): Promise<void> {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    await authService.logout(rawRefreshToken);
    clearAuthCookies(res);
    sendSuccess(res, { success: true });
  },

  async me(req: Request, res: Response): Promise<void> {
    // req.user is guaranteed by the requireAuth middleware that guards this route.
    const user = await authService.getCurrentUser(req.user!.id);
    sendSuccess(res, { user });
  },

  /**
   * Handles the Google OAuth callback.
   *
   * Uses passport's custom-callback form (rather than the usual
   * `passport.authenticate("google", {session:false})` as route
   * middleware directly) because we need to set cookies and redirect
   * ourselves, not just call next(). The strategy's verify callback
   * (config/passport.ts) already did all the DB work and hands us the
   * full AuthResult here as the "user" argument — used once, for this
   * single request, never stored in a session.
   */
  googleCallback(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate(
      "google",
      { session: false },
      (err: unknown, result: AuthResult | false) => {
        if (err || !result) {
          res.redirect(`${env.WEB_URL}/login?error=oauth_failed`);
          return;
        }

        setAuthCookies(res, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        res.redirect(env.WEB_URL);
      }
    )(req, res, next);
  },
};