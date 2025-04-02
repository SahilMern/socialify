console.log("JAI SHREE RAM JI / JAI BAJARANG BALI JI💖");

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./database/dbconfig.js"; //TODO:- Database Routes
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = 9080;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello World!"));

//? UserRoutes
import userRoutes from "./Routes/user.Routes.js";
import postRoutes from "./Routes/post.routes.js";
import messageRoutes from "./Routes/message.routes.js"

app.use("/api/v1", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);



app.listen(port, () => {
  connectDb();
  console.log(`Example app listening on port ${port}!`);
});
