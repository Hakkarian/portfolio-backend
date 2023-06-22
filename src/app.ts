import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Response, Request, NextFunction, application } from "express";
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import limitter from 'express-rate-limit';

import userRouter from './routes/userRoute';
import projectRouter from './routes/projectRoute';
import commentRouter from './routes/commentRoute';

const app: Application = express();

const port = process.env.PORT || 5000;
const mongoUrl: string = process.env.MONGO_URL || '';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/projects", commentRouter);

interface CustomError {
    status: number,
    message: string
}


app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const { status, message } = error;
    return res.status(status || 500).json({message});
})

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions).then(() => console.log('Database connection successful')).catch((error) => console.log('Databse connection failure:', error))


app.listen(port, () => {
    console.log(`Server listens on port ${port}`)
})