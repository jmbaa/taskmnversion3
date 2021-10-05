const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate-sequelize");

exports.createComment = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const comment = await req.db.comment.create(req.body);
    res.status(200).json({
        success: true,
        data: comment,
    });
});

// app/v1/comments/:id
exports.updateComment = asyncHandler(async (req, res, next) => {
    let comment = await req.db.comment.findByPk(req.params.commentId);

    if(!comment){
        throw new MyError(req.params.commentId + " id-тай коммент байхгүй!", 400);
    }

    comment = await comment.update(req.body);

    res.status(200).json({
        success: true,
        data: comment,
    });
});

// app/v1/comments/:id
exports.deleteComment = asyncHandler(async (req, res, next) => {
    let comment = await req.db.comment.findByPk(req.params.commentId);

    if(!comment){
        throw new MyError(req.params.commentId + " id-тай коммент байхгүй!", 400);
    }

    await comment.destroy();

    res.status(200).json({
        success: true,
        data: comment,
    });
});

// app/v1/comments/:id
exports.getComment = asyncHandler(async (req, res, next) => {
    const comment = await req.db.comment.findByPk(req.params.commentId);

    if(!comment){
        throw new MyError(req.params.commentId + " id-тай коммент байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        user: await comment.getUser(),
        // magic: Object.keys(req.db.book.prototype),
        data: comment,
    });
});


exports.getComments = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    let select = req.query.select;
    const sort = req.query.sort;

    if(select) {
        select = select.split(" ");
    }

    console.log(req.query, sort, select, limit);

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);
    
    // Pagination
    const pagination = await paginate(page, limit, req.db.comment);

    let query = {offset: pagination.start -1, limit};

    if(req.query) {
        query.where = req.query;
    }

    if(select){
        query.attributes = select;
    }

    if(sort){
        query.order = sort
            .split(" ")
            .map((el) => [
                el.charAt(0) === '-' ? el.substring(1) : el, 
                el.charAt(0) === '-' ? "DESC" : "ASC"]);
    }

    const comments = await req.db.comment.findAll(query);

    res.status(200).json({
        success: true,
        data: comments,
        pagination,
    });
});

// app/v1/comments/:id : getUser
exports.getUserComments = asyncHandler(async (req, res, next) => {
    const user = await req.db.user.findByPk(req.params.userId);

    if(!user){
        throw new MyError(req.params.userId + " id-тай хэрэглэгч байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        user: user,
        comment: await user.getComments(),
        // magic: Object.keys(req.db.book.prototype),
    });
});


// app/v1/comments/:id : getUser
exports.getBookComments = asyncHandler(async (req, res, next) => {
    const book = await req.db.user.findByPk(req.params.bookId, {
        include: req.db.comment,
    });

    if(!book){
        throw new MyError(req.params.bookId + " id-тай ном байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        book: book,
    });
});