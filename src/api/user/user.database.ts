// import { ObjectId } from "mongodb";
// import bcrypt from "bcrypt";
// import { AppError } from "../../errors/appErrors";
// import { StatusCode } from "../http/status-code";
// import { ErrorCodes } from "../common/errors";
import { Pagination } from "@lib/pagination";
import {UsersDB, IUser} from "./user.interface"

export namespace UserDatabase {
    // export const update = async (id: string, name: string, email: string, password: string) => {
    //     const filter = { _id: new ObjectId(id) };
    //         const hashedPassword = await bcrypt.hash(password, 10);
    //         const result = await UsersDB.findOneAndReplace(filter, { _id: new ObjectId(id), name, email, password: hashedPassword });
    //     if (result == null) {
    //         throw new AppError(StatusCode.NOT_FOUND, "usuário não encontrado", ErrorCodes.API.NotFound);
    //     }
    //     return { _id: result!._id.toString(), name: result!.name, email: result!.email };
    // };

    // export const deleteOne = async (id: string) => {
    //     const filter = { _id: new ObjectId(id) };
    //     const result = await UsersDB.findOneAndDelete(filter);
    //     if (result == null) {
    //         throw new AppError(StatusCode.NOT_FOUND, "usuário não encontrado", ErrorCodes.API.NotFound);
    //     }
    //     return result!.email;
    // };

    export const insertOne = async (data: Partial<IUser>): Promise<IUser> => {
      const user = new UsersDB(data);
      return await user.save();
    };

    export const findOne = async (filters?: {id?: IUser["id"], email?: IUser["email"]}): Promise<IUser> => {
        return await UsersDB.findOne(filters).then(user => user!);
    }

    export const list = async (filters: Pagination.Params): Promise<Array<IUser>> => {
        const{offset, pageSize} = filters;

        return await UsersDB
            .find()
            .skip((Number(offset) - 1) * Number(pageSize))
            .limit(Number(pageSize))
    };

    export const count = async () => {
        return await UsersDB.countDocuments();
    };
}
