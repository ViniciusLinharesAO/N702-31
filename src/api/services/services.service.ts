import { MongoServerError, ObjectId } from "mongodb";
import { servicesDB } from "./../../infra/database";
import { AppError } from "../../errors/appErrors";
import { StatusCode } from "../http/status-code";
import { ErrorCodes } from "../common/errors";

export namespace ServicesService {
    export const createServices = async (userId: string, title: string, description: string, image?: string) => {
        try {
            const result = await (await servicesDB).insertOne({ title, description, image, userId });
            return result.insertedId.toString();
        } catch (error) {
            if (error instanceof MongoServerError) {
                throw new AppError(StatusCode.BAD_REQUEST, error.message, ErrorCodes.API.Validation);
            }
            throw error;
        }
    };

    export const updateServices = async (id: string, title: string, description: string, image?: string) => {
        const filter = { _id: new ObjectId(id) };
        const result = await (await servicesDB).findOneAndReplace(filter, { _id: new ObjectId(id), title, description, image });
        if (!result) throw new AppError(StatusCode.NOT_FOUND, "serviço não encontrado", ErrorCodes.API.NotFound);

        return { _id: result._id.toString(), title: result.title, descricao: result.descricao, image: result.image };
    };

    export const deleteServices = async (id: string) => {
        const filter = { _id: new ObjectId(id) };
        const result = await (await servicesDB).findOneAndDelete(filter);
        if (!result) throw new AppError(StatusCode.NOT_FOUND, "serviço não encontrado", ErrorCodes.API.NotFound);

        return result._id;
    };

    export const getUser = async (
        userId: string
    ): Promise<{ _id: string; title: string, description: string, image?: string } | null> => {
        const result = await (await servicesDB).findOne({ _id: new ObjectId(userId) });

        if (!result) throw new AppError(StatusCode.BAD_REQUEST, "serviço não encontrado", ErrorCodes.API.Validation);

        return { _id: result._id.toString(), title: result.title, description: result.description, image: result.image };
    };

    export const listServices = async (
        userId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
    ): Promise<Array<{ _id: string; title: string, description: string, image?: string }>> => {
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }

        const results = await (
            await servicesDB
        )
            .find(filter)
            .sort("_id")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return results.map((result) => {
            return { _id: result._id.toString(), title: result.title, description: result.description, image: result.image };
        });
    };

    export const countServices = async (userId: string) => {
        const filter: any = {};
        if (userId) {
            filter.userId = userId;
        }
        return await (await servicesDB).countDocuments(filter);
    };
}
