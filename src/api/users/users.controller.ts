import { Request, Response, NextFunction } from "express";
import { AppError } from "./../../errors/appErrors";
import { CreateUserReqBody, RequestParams, RequestResponse, PaginatedResponse, PaginateQuery } from "./users.models";
import { UsersService } from "./users.service";
import { StatusCode } from "../http/status-code";

export namespace UserController {
    export const updateUser = async (
        req: Request<RequestParams, any, CreateUserReqBody>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { name, email, phoneNumber, password } = req.body;
            const result = await UsersService.updateUser(id, name, email, phoneNumber, password);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "usuários atualizado com sucesso", items: [result] });
        } catch (error: unknown) {
            console.error("Failed to update user", error);
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
            const result = await UsersService.deleteUser(id);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: `usuário com email ${result} deletado com sucesso`, items: [] });
        } catch (error: unknown) {
            console.error("Failed to update user", error);
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

    export const listAllUsers = async (
        req: Request<any, any, any, PaginateQuery>,
        res: Response<PaginatedResponse>,
        next: NextFunction,
    ) => {
        try {
            let { pageNumber, pageSize } = req.query;
            const [users, totalItems] = await Promise.all([
                await UsersService.listUsers(pageNumber, pageSize),
                await UsersService.countUsers(),
            ]);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "usuários listados com sucesso",
                items: users,
                pageNumber: pageNumber ? pageNumber : 1,
                pageSize: pageSize ? pageSize : 10,
                totalItems,
            });
        } catch (error: unknown) {
            console.error("Failed to list users", error);
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

    export const getUserById = async (
        req: Request<RequestParams, any, any, any>,
        res: Response<any>,
        next: NextFunction,
    ) => {
        try {
            let { id } = req.params;
            const user = await UsersService.getUser(id);
            return res.status(StatusCode.OK).json(user);
        } catch (error: unknown) {
            console.error("Failed to get user", error);
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
