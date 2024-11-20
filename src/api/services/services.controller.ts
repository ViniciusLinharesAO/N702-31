import { Request, Response, NextFunction } from "express";
import { AppError } from "./../../errors/appErrors";
import {
    CreateServicesReqBody,
    RequestParams,
    RequestResponse,
    PaginatedResponse,
    PaginateQuery,
} from "./services.models";
import { ServicesService } from "./services.service";
import { StatusCode } from "../http/status-code";
import { UsersService } from "../users/users.service";

export namespace ServicesController {
    export const createServices = async (
        req: Request<any, any, CreateServicesReqBody>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { title, description, image, userId } = req.body;
            await UsersService.getUser(userId);
            const result = await ServicesService.createServices(userId, title, description, image);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "serviço criado com sucesso", items: [result] });
        } catch (error: unknown) {
            console.error("Failed to create service", error);
            if (error instanceof AppError)
                return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
                    success: false,
                    message: error.message,
                    items: [],
                });
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "unexpected error",
                items: [],
            });
        }
    };
    export const updateServices = async (
        req: Request<RequestParams, any, CreateServicesReqBody>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { title, description, image } = req.body;
            const result = await ServicesService.updateServices(id, title, description, image);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "serviço atualizado com sucesso", items: [result] });
        } catch (error: unknown) {
            console.error("Failed to update services", error);
            if (error instanceof AppError)
                return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
                    success: false,
                    message: error.message,
                    items: [],
                });
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "unexpected error",
                items: [],
            });
        }
    };

    export const deleteUser = async (
        req: Request<RequestParams>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const result = await ServicesService.deleteServices(id);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: `serviço com id ${result} deletado com sucesso`, items: [] });
        } catch (error: unknown) {
            console.error("Failed to update services", error);
            if (error instanceof AppError)
                return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
                    success: false,
                    message: error.message,
                    items: [],
                });
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "unexpected error",
                items: [],
            });
        }
    };

    export const listServices = async (
        req: Request<any, any, any, PaginateQuery & { userId: string }>,
        res: Response<PaginatedResponse>,
        next: NextFunction,
    ) => {
        try {
            let { pageNumber, pageSize, userId } = req.query;
            const [users, totalItems] = await Promise.all([
                await ServicesService.listServices(userId, pageNumber, pageSize),
                await ServicesService.countServices(userId),
            ]);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "serviços listados com sucesso",
                items: users,
                pageNumber: pageNumber ? pageNumber : 1,
                pageSize: pageSize ? pageSize : 10,
                totalItems,
            });
        } catch (error: unknown) {
            console.error("Failed to update services", error);
            if (error instanceof AppError)
                return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
                    success: false,
                    message: error.message,
                    items: [],
                    pageNumber: 0,
                    pageSize: 0,
                    totalItems: 0,
                });
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "unexpected error",
                items: [],
                pageNumber: 0,
                pageSize: 0,
                totalItems: 0,
            });
        }
    };

    export const getServiceById = async (
        req: Request<RequestParams, any, any, any>,
        res: Response<any>,
        next: NextFunction,
    ) => {
        try {
            let { id } = req.params;
            const service = await ServicesService.getService(id);
            return res.status(StatusCode.OK).json(service);
        } catch (error: unknown) {
            console.error("Failed to get service", error);
            if (error instanceof AppError)
                return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
                    success: false,
                    message: error.message,
                    items: [],
                    pageNumber: 0,
                    pageSize: 0,
                    totalItems: 0,
                });
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "unexpected error",
                items: [],
                pageNumber: 0,
                pageSize: 0,
                totalItems: 0,
            });
        }
    };
}
