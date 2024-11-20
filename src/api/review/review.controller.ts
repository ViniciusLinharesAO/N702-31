import { Request, Response, NextFunction } from "express";
import { AppError } from "./../../errors/appErrors";
import { CreateReviewReqBody, RequestParams, RequestResponse, PaginatedResponse, PaginateQuery } from "./review.models";
import { ReviewService } from "./review.service";
import { StatusCode } from "../http/status-code";
import { UsersService } from "../users/users.service";
import { ServicesService } from "../services/services.service";

export namespace ReviewController {
    export const createReview = async (
        req: Request<any, any, CreateReviewReqBody>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { grade, description, userId, serviceId } = req.body;
            await UsersService.getUser(userId);
            await ServicesService.getService(serviceId);

            const result = await ReviewService.createReview(userId, serviceId, grade, description);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "review criado com sucesso", items: [result] });
        } catch (error: unknown) {
            console.error("Failed to create review", error);
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
    export const updateReview = async (
        req: Request<RequestParams, any, CreateReviewReqBody>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const { grade, description } = req.body;
            const result = await ReviewService.updateReview(id, grade, description);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: "review atualizado com sucesso", items: [result] });
        } catch (error: unknown) {
            console.error("Failed to update review", error);
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

    export const deleteReview = async (
        req: Request<RequestParams>,
        res: Response<RequestResponse>,
        next: NextFunction,
    ) => {
        try {
            const { id } = req.params;
            const result = await ReviewService.deleteReview(id);
            return res
                .status(StatusCode.OK)
                .json({ success: true, message: `review com id ${result} deletada com sucesso`, items: [] });
        } catch (error: unknown) {
            console.error("Failed to update review", error);
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

    export const listReviews = async (
        req: Request<any, any, any, PaginateQuery & { userId: string; serviceId: string }>,
        res: Response<PaginatedResponse>,
        next: NextFunction,
    ) => {
        try {
            let { pageNumber, pageSize, userId, serviceId } = req.query;
            const [users, totalItems] = await Promise.all([
                await ReviewService.listReview(userId, serviceId, pageNumber, pageSize),
                await ReviewService.countServices(userId, serviceId),
            ]);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "reviews listados com sucesso",
                items: users,
                pageNumber,
                pageSize,
                totalItems,
            });
        } catch (error: unknown) {
            console.error("Failed to update review", error);
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

    export const getReviewById = async (
        req: Request<RequestParams, any, any, any>,
        res: Response<any>,
        next: NextFunction,
    ) => {
        try {
            let { id } = req.params;
            const review = await ReviewService.getReview(id);
            return res.status(StatusCode.OK).json(review);
        } catch (error: unknown) {
            console.error("Failed to get review", error);
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
