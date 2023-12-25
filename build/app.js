"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// launching .env
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const session = require("express-session");
const cookieParser = require('cookie-parser');
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const projectRoute_1 = __importDefault(require("./routes/projectRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
// creating an application
const app = (0, express_1.default)();
app.use(cookieParser());
// determine that port will equal to placeholder value, alogn with mongo key
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || '';
// enables requests from different origins to access home API
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
// parses incoming requests with JSON uploads
app.use(express_1.default.json());
// allows to access the data from the request body using req.body
app.use(express_1.default.urlencoded({ extended: true }));
// serve static files for production build
app.use(express_1.default.static('public'));
// enables to store session data for each user
app.use(session({ secret: 'SECRET' }));
// start passport.js
app.use(passport_1.default.initialize());
// enables persistent login sessions
app.use(passport_1.default.session());
// main routes for users, projects and comments
app.use("/api/users", userRoute_1.default);
app.use("/api/projects", projectRoute_1.default);
app.use("/api/projects", commentRoute_1.default);
// it is the place which next(error) (continue to the error) refers to, default error handler
app.use((error, req, res, next) => {
    const { status, message } = error;
    return res.status(status || 500).json({ message });
});
// launching MongoDB
mongoose_1.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database connection successful')).catch((error) => console.log('Databse connection failure:', error));
// Holy Grail - starting the application
app.listen(port, () => {
    console.log(`Server listens on port ${port}`);
});
