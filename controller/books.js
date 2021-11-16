const Book = require('../models/Book');
const User = require('../models/User');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");


// app/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Book);

    const books = await Book.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit)
        .populate({
            path: 'category',
            select: 'name averagePrice',
        });;

    res.status(200).json({
        success: true,
        count: books.length,
        data: books,
        pagination,
    });
});

// app/v1/categories/:catId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Book);

    const books = await Book.find({ ...req.query, category: req.params.categoryId }, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit)
        .populate({
            path: 'category',
            select: 'name averagePrice',
        });

    res.status(200).json({
        success: true,
        count: books.length,
        data: books,
        pagination,
    });
});



exports.getBook = asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const book = await Book.findById(req.params.bookId);

    if (!book) {
        throw new MyError(req.params.bookId + " id тай ном байхгүй ээ", 400);
    }

    res.status(200).json({
        success: true,
        data: book,
    });
});

exports.createBook = asyncHandler(async (req, res, next) => {
    console.log(req.body);

    const category = await Category.findById(req.body.category);

    if (!category) {
        throw new MyError(req.body.categoryId + " id-тай категори байхгүй ээ", 400);
    }

    req.body.createdUser = req.userId;
    const book = await Book.create(req.body);

    res.status(200).json({
        success: true,
        data: book,
    });
});

exports.updateBook = asyncHandler(async (req, res, next) => {

    const book = await Book.findById(req.params.bookId);

    // const book = await Book.findByIdAndUpdate(
    //   req.params.bookId,
    //   req.body,
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // );

    if (!book) {
        throw new MyError(req.params.bookId + " id тай ном байхгүй ээ", 400);
    }

    if (book.createdUser.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн номын мэдээллийг засварлах боломжтой!", 400);
    }

    req.body.updatedUser = req.userId;

    for (let attr in req.body) {
        console.log(attr);
        book[attr] = req.body[attr];
    }

    book.save();

    res.status(200).json({
        success: true,
        data: book,
    });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
        throw new MyError(req.params.bookId + " id тай ном байхгүй!", 400);
    }

    if (book.createdUser.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн номын мэдээллийг засварлах боломжтой!", 400);
    }

    const user = await User.findById(req.userId);

    book.remove();

    res.status(200).json({
        success: true,
        data: book,
        deletedBy: user.name
    });

});

// PUT api/v1/books/:bookId/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
        throw new MyError(req.params.bookId + " id тай ном байхгүй ээ", 400);
    }

    const file = req.files.file;
    console.log(file);
    // image upload 
    if (!file.mimetype.startsWith("image")) {
        throw new MyError("Та зураг upload хийнэ үү.", 400);
    }

    if (file.size > process.env.MAX_UPLOAD_PHOTO_SIZE) {
        throw new MyError("Та зурагны хэмжээ хэт их байна", 400);
    }

    file.name = `photo-${req.params.bookId}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if (err) {
            throw new MyError("Файл хуулах явцад алдаа гарлаа: " + err.message, 400);
        }

        book.photo = file.name;
        book.save();

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});

// app/v1/books
exports.getUserBooks = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Book);

    req.query.createdUser = req.userId;

    console.log(req.query);

    const books = await Book.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit)
        .populate({
            path: 'category',
            select: 'name averagePrice',
        });;

    res.status(200).json({
        success: true,
        count: books.length,
        data: books,
        pagination,
    });
});
