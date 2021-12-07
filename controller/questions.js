const User = require('../models/User');
const Organization = require('../models/Organization');
const Question = require('../models/Question');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");

exports.getQuestion= asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const question = await Question.findById(req.params.questionId);

    if (!question) {
        throw new MyError(req.params.questionId + "-id тай үнийн санал байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: question,
    });
});

exports.createQuestion = asyncHandler(async (req, res, next) => {
    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    req.body.questionId = req.params.questionId;
    req.body.createdUserId = user.id;

    const question = await Question.create(req.body);

    res.status(200).json({
        success: true,
        data: question,
    });
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {

    const question = await Question.findById(req.params.questionId);

    if (!question) {
        throw new MyError(req.params.questionId + " id-тай асуулт байхгүй!", 400);
    }

    if (question.createdUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн асуултыг засварлах боломжтой!", 400);
    }
    
    req.body.createdUserId = req.userId;

    for (let attr in req.body) {
        // console.log(attr);
        question[attr] = req.body[attr];
    }
    
    question.save();

    res.status(200).json({
        success: true,
        data: question,
    });
});

exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
        throw new MyError(req.params.questionId+ " id-тай үнийн санал байхгүй!", 400);
    }

    if (question.createdUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн үнийн саналыг устгах боломжтой!", 400);
    }

    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    question.remove();

    res.status(200).json({
        success: true,
        data: question,
        deletedBy: user
    });

});
