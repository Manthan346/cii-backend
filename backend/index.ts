import Express, { json } from "express";
import type { Request, Response } from "express";
import cors from "cors"; // ADD THIS
import { candidateRouter } from "./src/routes/candidate-route/candidate-route";
// import { companyRouter } from "./routes/company-route/company-route";
import { courseRouter } from "./src/routes/course-route/course-route";
import userRouter from "./src/routes/user-route/user-route";
import cookieParser from "cookie-parser";
import { upload } from "./src/middlewares/multer-middleware/multer";

import { instructorRouter } from "./src/routes/instructor-routes/instructor-route";
import { login } from "./src/controllers/user-controllers/login";
import authRouter from "./src/routes/auth-route/auth-route";

const app = Express();
const port = 3000;

app.use(json());
app.use(cookieParser());

// ADD THIS BLOCK
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend's exact dev URL (Vite default port)
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running hello ");
});

app.use(
  Express.urlencoded({
    extended: true,
  }),
);

app.use("/api/v1/candidate", candidateRouter);
// app.use("/api/v1/company", companyRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/instructor", instructorRouter);
app.use("/api/v1/user", userRouter)
app.use("/api/v1/auth", authRouter)


app.listen(port, () => {
  console.log(`port is running on server ${port}`);
});
