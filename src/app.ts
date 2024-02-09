import dotenv from 'dotenv';
// launching .env
dotenv.config();

import express, { Application, Response, Request, NextFunction } from "express";
const session = require("express-session");
const cookieParser = require('cookie-parser');
import cors from 'cors';
import mongoose, { ConnectOptions } from 'mongoose';
import passport from 'passport';

import userRouter from './routes/userRoute';
import projectRouter from './routes/projectRoute';
import commentRouter from './routes/commentRoute';

// creating an application
const app: Application = express();
app.use(cookieParser());

// determine that port will equal to placeholder value, alogn with mongo key
const port = process.env.PORT || 5000;
const mongoUrl: string = process.env.MONGO_URL || '';
const clientUrl = process.env.CLIENT_URL;

// enables requests from different origins to access home API
app.use(
  cors({ origin: "https://porfolio-frontend.vercel.app", credentials: true })
);

// parses incoming requests with JSON uploads
app.use(express.json());
// allows to access the data from the request body using req.body
app.use(express.urlencoded({ extended: true }));
// serve static files for production build
app.use(express.static('public'));
// enables to store session data for each user
app.use(session({ secret: 'SECRET' }))
// start passport.js
app.use(passport.initialize());
// enables persistent login sessions
app.use(passport.session());

// main routes for users, projects and comments
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/projects", commentRouter);

// blueprint of a custom error
interface CustomError {
    status: number,
    message: string
}

// it is the place which next(error) (continue to the error) refers to, default error handler
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const { status, message } = error;
    return res.status(status || 500).json({message});
})

// launching MongoDB
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions).then(() => console.log('Database connection successful')).catch((error) => console.log('Databse connection failure:', error))

// Holy Grail - starting the application
app.listen(port, () => {
    console.log(`Server listens on port ${port}`)
})