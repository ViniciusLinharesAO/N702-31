import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { StatusCode } from "../http/status-code";
import { IUser } from "./user.interface";
import { Pagination } from "@lib/pagination";

export namespace UserController {
    // export const update = async (
    //     req: Request<RequestParams, any, CreateUserReqBody>,
    //     res: Response<RequestResponse>,
    //     next: NextFunction,
    // ) => {
    //     try {
    //         const { id } = req.params;
    //         const { name, email, password } = req.body;
    //         const result = await UsersService.update(id, name, email, password);
    //         return res
    //             .status(StatusCode.OK)
    //             .json({ success: true, message: "usuários atualizado com sucesso", items: [result] });
    //     } catch (error: unknown) {
    //         console.error("Failed to update user", error);
    //         if (error instanceof AppError)
    //             return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
    //                 success: false,
    //                 message: error.message,
    //                 items: [],
    //             });
    //         return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: "unexpected error",
    //             items: [],
    //         });
    //     }
    // };

    // export const deleteOne = async (
    //     req: Request<RequestParams>,
    //     res: Response<RequestResponse>,
    //     next: NextFunction,
    // ) => {
    //     try {
    //         const { id } = req.params;
    //         const result = await UsersService.deleteOne(id);
    //         return res
    //             .status(StatusCode.OK)
    //             .json({ success: true, message: `usuário com email ${result} deletado com sucesso`, items: [] });
    //     } catch (error: unknown) {
    //         console.error("Failed to update user", error);
    //         if (error instanceof AppError)
    //             return res.status(error.status === undefined ? StatusCode.INTERNAL_SERVER_ERROR : error.status).json({
    //                 success: false,
    //                 message: error.message,
    //                 items: [],
    //             });
    //         return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    //             success: false,
    //             message: "unexpected error",
    //             items: [],
    //         });
    //     }
    // };

    export const listAll = async (
        req: Request<any, any, any, Pagination.Params>,
        res: Response<Pagination<IUser> | {error: string}>,
        next: NextFunction,
    ) => {
        try {
            const result = await UserService.listAll(req.query);
            res.status(StatusCode.OK).json(result);
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve users" });
        }
    };
}
