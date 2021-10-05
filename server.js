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
const commentsRoutes = require("./routes/comment.js");
const connectDB = require('./config/db');
const injectDb = require("./middleware/injectDb");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

connectDB_();


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
app.use(injectDb(db));
app.use(morgan('combined', {stream: accessLogStream}));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes); 
app.use("/api/v1/comments", commentsRoutes); 
app.use(errorHandler);

db.user.belongsToMany(db.book, { through: db.comment });
db.book.belongsToMany(db.user, { through: db.comment });
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);
db.category.hasMany(db.book);
db.book.belongsTo(db.category);
db.book.hasMany(db.comment);
db.comment.belongsTo(db.book);

db.sequelize
  .sync()
  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));


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