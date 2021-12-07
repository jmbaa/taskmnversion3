const express = require('express');
const dotenv = require("dotenv"); 
const path = require('path');
const connectDB_ = require('./config/db');


const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const logger = require('./middleware/logger');
const colors = require('colors');
const fileupload = require('express-fileupload');
// Route оруулж ирэх
const errorHandler = require('./middleware/error');
const categoriesRoutes = require("./routes/categories.js");
const booksRoutes = require("./routes/books.js");
const usersRoutes = require("./routes/users.js");
const tasksRoutes = require("./routes/tasks.js");
const taskCategoryRoutes = require("./routes/taskCategories.js");
const surveyTypeRoutes = require("./routes/surveyTypes.js");
const organizationsRoutes = require("./routes/organizations.js");
const commentsRoutes = require("./routes/comment.js");
const surveysRoutes = require("./routes/surveys.js");
const questionTypeRoutes = require("./routes/questionTypes.js");
const connectDB = require('./config/db');
const injectDb = require("./middleware/injectDb");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

connectDB();


const app = express();

console.log(__dirname);
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })

// body parser
app.use(express.json());
app.use(fileupload());
app.use(logger);
app.use(morgan('combined', {stream: accessLogStream}));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/tasks", tasksRoutes);
app.use("/api/v1/users", usersRoutes); 
app.use("/api/v1/task-categories", taskCategoryRoutes);   
app.use("/api/v1/organizations", organizationsRoutes);  
app.use("/api/v1/survey-types", surveyTypeRoutes);  
app.use("/api/v1/question-types", questionTypeRoutes);  
app.use("/api/v1/comments", commentsRoutes); 
app.use("/api/v1/surveys", surveysRoutes); 
app.use(errorHandler);

const server = app.listen(
    process.env.PORT,
    console.log(`Express сервер ${process.env.PORT} порт дээр аслаа . . .`)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Алдаа гарлаа: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

