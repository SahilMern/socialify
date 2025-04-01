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
import UserRoutes from "./Routes/user.Routes.js";
app.use("/api/v1", UserRoutes);

app.listen(port, () => {
  connectDb();
  console.log(`Example app listening on port ${port}!`);
});
