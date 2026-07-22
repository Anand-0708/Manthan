import type { Request, Response } from "express";
import { emailService } from "./email.service";

export const emailController = {
  async test(
    _req: Request,
    res: Response
  ) {
    try {
      await emailService.send(
        "ay168956@gmail.com",
        "Manthan Email Test",
        `
          <h1>Email Working ✅</h1>
          <p>This email was sent from Manthan Conference System.</p>
        `
      );

      res.json({
        success: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      console.error("SMTP ERROR:", error);

      res.status(500).json({
        success: false,
        error,
      });
    }
  },
};