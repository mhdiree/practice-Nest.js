import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionsHandler {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        let message = "서버 오류가 발생했습니다.";

        // NestJS 기본 에러 응답
        if (typeof errorResponse === 'object' && errorResponse !== null) {
            message = (errorResponse as any).message || message;
        } else if (typeof errorResponse === 'string') {
            message = errorResponse;
        }


        response
            .status(status)
            .json({
                success: false,
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            })
    }
}