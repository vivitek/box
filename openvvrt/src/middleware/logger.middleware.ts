import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("loggerMiddleware");

  public use = (req: Request, res: Response, next: Function) => {
    const receivedAt = Date.now();

    res.on("finish", () => {
      const responseTime = Date.now() - receivedAt;
      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} +${responseTime}ms`
      );
    });
    next();
  }
}