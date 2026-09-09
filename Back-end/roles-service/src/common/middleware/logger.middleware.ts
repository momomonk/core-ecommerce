import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JsonLogger } from '../../common/json-logger';
import { LogContext } from '../constants/log-context';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new JsonLogger();

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params, ip } = req;
    const startTime = Date.now();

    res.on(LogContext.REQUEST_FINISH, () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      this.logger.log({
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        ip,
        body: body ? { ...body, password: body.password ? '*' : undefined } : undefined,
        query,
        params,
      }, LogContext.HTTP_REQUEST);
    });

    next();
  }
}