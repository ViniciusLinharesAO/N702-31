// import { AppError } from "../../errors/appErrors";
import { Pagination } from "@lib/pagination";
import { UserDatabase } from "./user.database";
import { IUser } from "./user.interface";

export namespace UserService {
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

    export const insertOne = async (user: IUser): Promise<IUser> => {
        const result = await UserDatabase.insertOne(user);
        return result.id.toString();
    };

    export const listAll = async (
        filters: Pagination.Params
    ): Promise<Pagination<IUser>> => {
        const [users, totalItems] = await Promise.all([
            await UserDatabase.list(filters),
            await UserDatabase.count(),
        ]);

        return Pagination.paginate(users, totalItems, filters)
    };
}
