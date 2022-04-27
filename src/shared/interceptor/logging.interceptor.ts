import { Injectable, NestInterceptor, ExecutionContext, Logger, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger;

  constructor() {
    this.logger = new MyLogger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method.toUpperCase();
    const headers = req.headers;
    const url = req.url;

    // console.log(req);

    return next.handle().pipe(
      tap(() => this.logger.log(
        `${headers.origin} ${method} - ${url}`,
        context.getClass().name,
      ),
      ),
    );
  }
}