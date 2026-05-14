import express from "express";
import cors from "cors";
import subjectsRouter from "./routes/subjects.js";

const app = express();
const port = 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/subjects", subjectsRouter);

app.use("/", (req, res) => {
  res.send("Hello Welcome To The Classroom API!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
