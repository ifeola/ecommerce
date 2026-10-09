import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";

const PORT = process.env.PORT ?? 4000;
const app = express();

app.use(cors());
app.use(cookieParse());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is lsitening on port ${PORT}`);
});
