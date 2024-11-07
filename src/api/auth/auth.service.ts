import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../errors/appErrors";
import { ErrorCodes } from "../common/errors";
import { StatusCode } from "../http/status-code";
import { MongoServerError } from "mongodb";
import { SECRET_KEY } from "./../common/auth";
import { UserDatabase } from "../user/user.database";
import { IUser } from "../user/user.interface";

export namespace AuthService {
    export const loginUser = async (
        filters: {
            email: IUser["email"],
            password: IUser["password"],
        }
    ): Promise<{ user: Omit<IUser, "password">; token: string }> => {
        try {
            const user = await UserDatabase.findOne(filters);
            const validPassword = await bcrypt.compare(filters.password, user.password);
            if (validPassword === false) {
                throw new AppError(StatusCode.UNAUTHORIZED, "email ou senha errados", ErrorCodes.API.Unauthorized);
            }
            const token = jwt.sign({ _id: user._id?.toString(), email: user.email }, SECRET_KEY, {
                expiresIn: "2 days",
            });

            return { user, token: token };
        } catch (error) {
            if (error instanceof MongoServerError) {
                throw new AppError(StatusCode.BAD_REQUEST, error.message, ErrorCodes.API.Validation);
            }
            throw error;
        }
    };
}
