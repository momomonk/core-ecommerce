import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  log(message: any, context?: string) {
    this.print('INFO', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.print('ERROR', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.print('WARN', message, context);
  }

  private print(level: string, message: any, context?: string, trace?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: typeof message === 'object' ? message : { content: message },
      trace,
    };
    process.stdout.write(JSON.stringify(logEntry) + '\n');
  }
}