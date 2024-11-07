import { Request, Response, NextFunction } from "express";
import { LoginReqBody, RequestResponse } from "./auth.models";
import { AuthService } from "./auth.service";
import { StatusCode } from "../http/status-code";
import { IUser } from "../user/user.interface";
import { UserService } from "../user/user.service";

export namespace AuthController {
    // export const register = async (
    //     req: Request<any, any, RegisterReqBody>,
    //     res: Response<RequestResponse>,
    //     next: NextFunction,
    // ) => {
    //     try {
    //         const { name, email, password } = req.body;
    //         const result = await AuthService.createUser(name, email, password);
    //         return res
    //             .status(StatusCode.OK)
    //             .json({ success: true, message: "usuário criado com sucesso", items: [{ userId: result }] });
    //     } catch (error: unknown) {
    //         console.error("Failed to register user", error);
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

    export const register = async (
        req: Request<any, any, IUser>,
        res: Response<RequestResponse<IUser> | {error: string}>,
        next: NextFunction,
    ) => {
        try {
            await UserService.insertOne(req.body);
            res.status(StatusCode.CREATED);
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to register user" });
        }
    };

    export const login = async (
        req: Request<any, any, any, LoginReqBody>,
        res: Response<{ user: Omit<IUser, "password">; token: string } | {error: string}>,
        next: NextFunction,
    ) => {
        try {
            const {} = req.query
            const result = await AuthService.loginUser(req.query);
            res.status(StatusCode.OK).json(result);
        } catch (error) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve users" });
        }
    };

    // export const oldlogin = async (
    //     req: Request<any, any, RegisterReqBody>,
    //     res: Response<RequestResponse<IUser>>,
    //     next: NextFunction,
    // ) => {
    //     try {
    //         const { email, password } = req.body;
    //         const result = await AuthService.loginUser(email, password);
    //         return res
    //             .status(StatusCode.OK)
    //             .json({ success: true, message: "usuário logado com sucesso", items: [result] });
    //     } catch (error: unknown) {
    //         console.error("Failed to register user", error);
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
}
