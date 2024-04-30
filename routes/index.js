import express from "express";
import authRoute from "./auth.js";
import userRoute from "./users.js";
import postRoute from "./posts.js";

const router = express.Router();

router.post("/auth/login", authRoute.login);
router.post("/auth/register", authRoute.register);

router.use("/users", userRoute);
router.use("/posts", postRoute);

export default router;
