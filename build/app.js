"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const projectRoute_1 = __importDefault(require("./routes/projectRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || '';
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)());
app.use("/api/users", userRoute_1.default);
app.use("/api/projects", projectRoute_1.default);
app.use("/api/projects", commentRoute_1.default);
app.use((error, req, res, next) => {
    const { status, message } = error;
    return res.status(status || 500).json({ message });
});
mongoose_1.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database connection successful')).catch((error) => console.log('Databse connection failure:', error));
app.listen(port, () => {
    console.log(`Server listens on port ${port}`);
});
