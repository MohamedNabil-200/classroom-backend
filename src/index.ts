import express from "express";
import cors from "cors";
import subjectsRouter from "./routes/subjects.js";

const app = express();
const port = 8000;

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) throw new Error ("FRONTEND_URL is required")

app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/subjects", subjectsRouter);

app.get("/", (req, res) => {
  res.send("Hello Welcome To The Classroom API!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
