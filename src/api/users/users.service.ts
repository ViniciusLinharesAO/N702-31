import { ObjectId } from "mongodb";
import { userDB } from "./../../infra/database";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/appErrors";
import { StatusCode } from "../http/status-code";
import { ErrorCodes } from "../common/errors";

export namespace UsersService {
    export const updateUser = async (id: string, name: string, email: string, password: string) => {
        const user = await getUser(id, undefined)

        const filter = { _id: new ObjectId(id) };

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = {...user, password: "", _id: new ObjectId(id)}
        if (name) newUser.name = name
        if (email) newUser.email = email
        if (password) newUser.password = hashedPassword

        const result = await (await userDB).findOneAndReplace(filter, newUser);
        if (!result) throw new AppError(StatusCode.NOT_FOUND, "usuário não encontrado", ErrorCodes.API.NotFound);

        return { _id: result._id.toString(), name: result.name, email: result.email };
    };

    export const deleteUser = async (id: string) => {
        const filter = { _id: new ObjectId(id) };
        const result = await (await userDB).findOneAndDelete(filter);
        if (!result) throw new AppError(StatusCode.NOT_FOUND, "usuário não encontrado", ErrorCodes.API.NotFound);

        return result.email;
    };

    export const getUser = async (
        userId?: string,
        email?: string
    ): Promise<{ _id: string; name: string; email: string } | null> => {
        const filter: any = {};

        if (userId) {
            filter._id = new ObjectId(userId);
        }

        if (email) {
            filter.email = email;
        }

        const result = await (await userDB).findOne(filter);

        if (!result) throw new AppError(StatusCode.BAD_REQUEST, "usuário não encontrado", ErrorCodes.API.Validation);

        return { _id: result._id.toString(), name: result.name, email: result.email };
    };

    export const listUsers = async (
        pageNumber: number = 1,
        pageSize: number = 10,
    ): Promise<Array<{ _id: string; name: string; email: string }>> => {
        const results = await (
            await userDB
        )
            .find()
            .sort("_id")
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return results.map((result) => {
            return { _id: result._id.toString(), name: result.name, email: result.email };
        });
    };

    export const countUsers = async () => {
        return await (await userDB).countDocuments();
    };
}
