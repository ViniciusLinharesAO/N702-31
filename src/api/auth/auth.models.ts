import { IUser } from "../user/user.interface";

export type LoginReqBody = {
    email: IUser["email"];
    password: IUser["password"];
};

export type RequestResponse<T> = {
    success: boolean;
    message: string;
    items: Array<T>;
};
