import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DatetimeService } from '../helpers/datetime.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger;
  private datetimeService;

  constructor() {
    this.logger = new Logger('HttpExceptionFilter');
    this.datetimeService = new DatetimeService;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const authorization = (`${request.headers.authorization}`.split('Bearer '))[1];

    if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof exception.response !== 'string') {
        exception.response['message'] = exception.response.message || 'You do not have permission to access this resource';
      }
    } else if (exception.getStatus() == HttpStatus.FORBIDDEN) {
      const bearer = jwt.decode(authorization);
      // Logger.error(bearer[`exp`], 'ExceptionFilter');
      if (bearer) {
        if (bearer[`exp`] < (Date.now() / 1000)) {
          if (typeof exception.response !== 'string') {
            exception.response['message'] = exception.response.message || 'You do not have permission to access this resource';
          }
        }
      }
    }

    const errorResponse = {
      status,
      timestamp: this.datetimeService.format('YYYY-MM-DD H:i:s'),
      path: request.url,
      method: request.method,
      message: "error : " + (typeof exception.message.message !== 'undefined' ? exception.message.message : exception.message),
      displayTotal: 0,
      total: 0,
      state: null,
      items: {}
    };
    this.logger.error(errorResponse);

    response
      .status(status)
      .json(errorResponse);
  }
}
