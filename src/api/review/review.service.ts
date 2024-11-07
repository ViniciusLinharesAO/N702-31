import { MongoServerError, ObjectId } from "mongodb";
import { reviewDB } from "./../../infra/database";
import { AppError } from "../../errors/appErrors";
import { StatusCode } from "../http/status-code";
import { ErrorCodes } from "../common/errors";

export namespace ReviewService {
    export const createReview = async (userId: string, serviceId: string, grade: string, description?: string) => {
        try {
            const result = await (await reviewDB).insertOne({ grade, description, userId, serviceId });
            return result.insertedId.toString();
        } catch (error) {
            if (error instanceof MongoServerError) {
                throw new AppError(StatusCode.BAD_REQUEST, error.message, ErrorCodes.API.Validation);
            }
            throw error;
        }
    };

    export const updateReview = async (id: string, grade: string, description?: string) => {
        const filter = { _id: new ObjectId(id) };
        const result = await (await reviewDB).findOneAndReplace(filter, { _id: new ObjectId(id), grade, description });
        if (result == null) {
            throw new AppError(StatusCode.NOT_FOUND, "serviço não encontrado", ErrorCodes.API.NotFound);
        }
        return { _id: result!._id.toString(), grade: result!.grade, descricao: result!.descricao, image: result!.image };
    };

    export const deleteReview = async (id: string) => {
        const filter = { _id: new ObjectId(id) };
        const result = await (await reviewDB).findOneAndDelete(filter);
        if (result == null) {
            throw new AppError(StatusCode.NOT_FOUND, "serviço não encontrado", ErrorCodes.API.NotFound);
        }
        return result!._id;
    };

    export const listReview = async (
        userId: string,
        serviceId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
    ): Promise<Array<{ _id: string; grade: string, description?: string }>> => {
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }
        if (serviceId) {
            filter.serviceId = serviceId;
        }

        const results = await (
            await reviewDB
        )
            .find(filter)
            .sort("_id")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return results.map((result) => {
            return { _id: result._id.toString(), grade: result.grade, description: result.description, image: result.image };
        });
    };

    export const countServices = async (userId: string, serviceId: string ) => {
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }
        if (serviceId) {
            filter.serviceId = serviceId;
        }
        return await (await reviewDB).countDocuments(filter);
    };
}
