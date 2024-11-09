import { Router } from "express";
import { UserController } from "./users/users.controller";
import { ServicesController } from "./services/services.controller";
import { AuthController } from "./auth/auth.controller";
import { auth } from "./common/auth";
import { ReviewController } from "./review/review.controller";

const authRouter = Router()
    .post("/register", AuthController.register)
    .post("/login", AuthController.login);

const userRouter = Router()
    .use(auth)
    .get("/", UserController.listAllUsers)
    .patch("/:id", UserController.updateUser)
    .delete("/:id", UserController.deleteUser);

const servicesRouter = Router()
    .use(auth)
    .get("/", ServicesController.listServices)
    .post("/", ServicesController.createServices)
    .patch("/:id", ServicesController.updateServices)
    .delete("/:id", ServicesController.deleteUser);

const reviewRouter = Router()
    .use(auth)
    .get("/", ReviewController.listReviews)
    .post("/", ReviewController.createReview)
    .patch("/:id", ReviewController.updateReview)
    .delete("/:id", ReviewController.deleteReview);

const v1Routes = Router()
    .use("/auth", authRouter)
    .use("/users", userRouter)
    .use("/services", servicesRouter)
    .use("/review", reviewRouter);

export default Router().use("/v1", v1Routes);
