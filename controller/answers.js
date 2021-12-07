const User = require('../models/User');
const Organization = require('../models/Organization');
const Answer = require('../models/Answers');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");

//  api/v1/surveys/:surveyId/questions/:questionId
exports.getAnswers = asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const answers = await Answer.find({questionId: req.params.questionId}); 

    if (!answers) {
        throw new MyError(req.params.questionId + " id-тай асуулт байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: answers,
    });
});

//  api/v1/surveys/:surveyId/questions/:questionId
exports.createAnswer = asyncHandler(async (req, res, next) => {
    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    req.body.questionId = req.params.questionId;
    req.body.answeredUserId = user._id;

    const answer = await Answer.create(req.body);

    res.status(200).json({
        success: true,
        data: answer,
    });
});


exports.updateAnswer = asyncHandler(async (req, res, next) => {

    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
        throw new MyError(req.params.answerId + " id-тай хариулт байхгүй!", 400);
    }

    if (answer.answeredUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн хариултыг засварлах боломжтой!", 400);
    }
    
    req.body.answeredUserId = req.userId;

    for (let attr in req.body) {
        // console.log(attr);
        answer[attr] = req.body[attr];
    }
    
    answer.save();

    res.status(200).json({
        success: true,
        data: answer,
    });
});

exports.deleteAnswer = asyncHandler(async (req, res, next) => {
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
        throw new MyError(req.params.answerId+ " id-тай хариулт байхгүй!", 400);
    }

    if (answer.answeredUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн хариултыг устгах боломжтой!", 400);
    }

    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    answer.remove();

    res.status(200).json({
        success: true,
        data: answer,
        deletedBy: user
    });

});
