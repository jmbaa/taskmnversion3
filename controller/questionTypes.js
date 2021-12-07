const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");
const QuestionType = require("../models/QuestionType.js");

exports.getQuestionTypes = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, QuestionType);

    // console.log(req.query, sort, select, limit);
    const questionTypes = await QuestionType.find()
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: questionTypes,
    });
});

exports.getQuestionType = asyncHandler(async (req, res, next) => {
    const questionType = await QuestionType.findById(req.params.questionTypeId);

    if (!questionType) {
        throw new MyError(req.params.questionTypeId + " id-тай асуултын төрөл байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: questionType,
    });
});

exports.createQuestionType = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const questionType = await QuestionType.create(req.body);
    res.status(200).json({
        success: true,
        data: questionType,
    });
});

exports.updateQuestionType = asyncHandler(async (req, res, next) => {
    const questionType = await QuestionType.findByIdAndUpdate(
        req.params.questionTypeId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!questionType) {
        throw new MyError(req.params.questionTypeId + " id-тай асуултын төрөл байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: questionType,
    });
});

exports.deleteQuestionType = asyncHandler(async (req, res, next) => {
    const questionType = await QuestionType.findById(req.params.questionTypeId);
    if (!questionType) {
        throw new MyError(req.params.questionTypeId + " id-тай судалгааны төрөл байхгүй!", 400);
    }

    questionType.remove();

    res.status(200).json({
        success: true,
        data: questionType,
    });

});