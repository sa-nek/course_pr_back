//imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
import postRouter from "./routes/posts.js";
import { authController } from "./controllers/auth.js";
import { postsController } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { v4 as uuid } from "uuid";

//configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json({ limit: "30mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://course-pr-front.onrender.com"],
  })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, uuid().toString() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

//Routes
app.post("/auth/register", upload.single("picture"), authController.register);
app.post(
  "/posts",
  verifyToken,
  upload.single("picture"),
  postsController.createPost
);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

//Mongo setup
const PORT = process.env.PORT || 3002;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(PORT, () => {
      console.log("Server is running on PORT: ", PORT);
    })
  )
  .catch((error) => console.log(error));
