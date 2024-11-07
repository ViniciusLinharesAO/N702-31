import { Router } from "express";
import { AuthController } from "./auth/auth.controller";
import { UserController } from "./user/user.controller";
// import { ServiceController } from "./userService/userService.controller";
// import { ReviewController } from "./review/review.controller";
import { auth } from "./common/auth";

const authRouter = Router() //
    .post("/register", AuthController.register)
    .post("/login", AuthController.login);

const userRouter = Router() //
    .use(auth)
    .get("/", UserController.listAll)
    // .patch("/:id", UserController.update)
    // .delete("/:id", UserController.deleteOne);

// const userServiceRouter = Router()
//     .use(auth)
//     // .post("/", ServiceController.createService)
//     .get("/", ServiceController.listAll)
//     .put("/:id", ServiceController.update)
//     .delete("/:id", ServiceController.deleteOne);

// const reviewRouter = Router()
//     .use(auth)
//     // .post("/", ReviewController.createReview)
//     .get("/", ReviewController.listAll)
//     .put("/:id", ReviewController.update)
//     .delete("/:id", ReviewController.deleteOne);


const v1Routes = Router() //
    .use("/auth", authRouter)
    .use("/users", userRouter)
    // .use("/user-service", userServiceRouter)
    // .use("/review", reviewRouter)
        ;

export default Router().use("/v1", v1Routes);
