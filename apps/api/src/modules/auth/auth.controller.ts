import type { Request, Response } from "express";
import { clearAuthCookies, REFRESH_COOKIE_NAME, setAuthCookies } from "../../common/utils/cookies";
import { sendSuccess } from "../../common/utils/apiResponse";
import { authService } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.validators";

export const authController = {
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
};