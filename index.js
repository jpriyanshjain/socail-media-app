import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import AuthRoutes from "./routes/AuthRoute.js"
import UserRoutes from "./routes/UserRoutes.js"
import PostRoutes from './routes/PostRoutes.js'


dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));



mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is started at port ${process.env.PORT}`)
  })
}).catch((error) => console.log(error));

// routes

app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/post', PostRoutes)



app.use((err, req, res, next) => {
  if (res.status) {
    console.error(err);
    return res.send(err.message);
  }
  res.status(500).json(err);
})


