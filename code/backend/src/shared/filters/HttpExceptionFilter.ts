import {Catch, HttpException, ExceptionFilter, ArgumentsHost, Logger, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';
import {CustomError} from "@drill-down/common";

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

        const error: CustomError = {
            name: exception.name,
            code: status,
            timestamp: new Date().toISOString(),
            method: request.method,
            origin: request.url,
            message,
            errors,
        };

        this.logger.error(`HTTP Exception - code: ${error.code}, method: ${error.method}, origin: ${error.origin}, message: ${message}`);

        response
            .status(status)
            .json(error as object);
    }
}
