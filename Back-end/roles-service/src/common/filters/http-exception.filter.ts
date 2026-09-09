import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { JsonLogger } from '../json-logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new JsonLogger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();

    this.logger.error(message, exception.stack, 'HttpExceptionFilter');

    response.status(status).json({
      success: false,
      data: null,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}