import Express, { json } from "express";
import type { Request, Response } from "express";
import cors from "cors"; // ADD THIS
import { candidateRouter } from "./routes/candidate-route/candidate-route";
import { companyRouter } from "./routes/company-route/company-route";
import { courseRouter } from "./routes/course-route/course-route";
import cookieParser from "cookie-parser";
import { upload } from "./src/middlewares/multer-middleware/multer";

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
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/courses", courseRouter);

app.listen(port, () => {
  console.log(`port is running on server ${port}`);
});
