import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";
import router from "./routes/index.js";
import helmet from "helmet";
import morgan from "morgan";
import type { Express } from "express";
import type { CorsOptions } from "cors";
import authenticate from "./controllers/auth/session.ts";
import errorMiddleware from "./middlewares/errorMiddleware.ts";

const PORT = process.env.PORT ?? 4000;
const app: Express = express();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000", "https://example.com"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParse());
app.use(express.json());
app.use(helmet());
// app.use(morgan("dev"));
app.use(morgan(":method :url :status :response-time ms"));
app.use(authenticate);
app.use(errorMiddleware);
app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is lsitening on port ${PORT}`);
});
