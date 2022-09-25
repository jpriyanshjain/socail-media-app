import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRoutes from "./routes/AuthRoute.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import UploadRoute from "./routes/UploadRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// to serve images inside public folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is started at port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));

// routes

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/posts", PostRoutes);
app.use("/upload", UploadRoute);
app.get("/", (req, res) => {
  res.json("application is working");
});

app.use((err, req, res, next) => {
  if (res.status) {
    console.error(err);
    return res.send(err.message);
  }
  res.status(500).json(err);
});
