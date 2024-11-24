import express from "express";
import router from "./Router/router.js";
import database from "./database/db_connector.js";
import errorHandler from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./Router/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 4001;

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

//error handler route
app.use(errorHandler);

// const rows = await database.client.query('SELECT * FROM users');
// console.table(rows.rows);


export default app;
