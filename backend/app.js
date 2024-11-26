import express from "express";
import router from "./Router/router.js";
import database from "./database/db_connector.js";
import errorHandler from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./Router/authRoutes.js";
import userRouter from "./Router/userRouter.js"
import connectionRequestRouter from "./Router/connectionRequestRouter.js"
import connectionRouter from "./Router/connectionRouter.js"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

//connect database
database.connectDB();
//express
app.use(express.json());  
//cookie
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

//routing
app.use('/', router); 
app.use("/api/auth", authRoutes);
app.use("/api/profile", router);
app.use("/api/users", userRouter);
app.use("/api/connection-requests", connectionRequestRouter);
app.use("/api/connections", connectionRouter);

//error handler route
app.use(errorHandler);

export default app;
