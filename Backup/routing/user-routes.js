import { Router } from "express";
import { getallusers, getUserById, login, signup } from "../controllers/user-controllers";

const userRouter = Router();

userRouter.get("/", getallusers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup",signup)
userRouter.post("/login",login)

export default userRouter;
