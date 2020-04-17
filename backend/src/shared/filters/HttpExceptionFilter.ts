import {Catch, HttpException, ExceptionFilter, ArgumentsHost, Logger, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';

/* https://docs.nestjs.com/exception-filters */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    private logger = new Logger('HttpExceptionFilter');
    catch(exception: any, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.response.message ||  exception.message;
        const errors = exception.response && exception.response.error ? exception.response.error || exception.error : [];

        this.logger.error(`HTTP Exception ${status} on route: ${request.method} "${request.url}": ${message}`);

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                method: request.method,
                path: request.url,
                message,
                errors: errors,
            } as object);
    }
}
