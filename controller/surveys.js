const User = require('../models/User');
const Survey = require('../models/Survey');
const Question = require('../models/Question');
const Organization = require('../models/Organization');
const SurveyType = require('../models/SurveyType');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");

// app/v1/surveys ~ судалгаануудын жагсаалт авна.
exports.getSurveys = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Хуудаслалт
    const pagination = await paginate(page, limit, Survey);

    const surveys = await Survey.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    // Хариу
    res.status(200).json({
        success: true,
        pagination,
        data: surveys,
    });
});

// app/v1/survey-categories/:surveyId/surveys ~ Тухайн ангилалын таскууд
exports.getSurveysByType = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Хуудаслалт
    const pagination = await paginate(page, limit, Survey);

    const surveys = await Survey.find({...req.query, taskCategory: req.params.surveyTypeId }, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: surveys.length,
        pagination,
        data: surveys,
    });
});

exports.getSurvey = asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
        throw new MyError(req.params.surveyId + "-id тай судалгаа байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: survey,
    });
});

exports.createSurvey = asyncHandler(async (req, res, next) => {

    // console.log(req.body);

    const surveyType = await SurveyType.findById(req.body.surveyType);

    if (!surveyType) {
        throw new MyError(req.body.surveyType + " id-тай судалгааны төрөл байхгүй!", 400);
    }

    req.body.createdUserId = req.userId;    
    const survey = await Survey.create(req.body);

    res.status(200).json({
        success: true,
        data: survey,
    });
});

exports.updateSurvey = asyncHandler(async (req, res, next) => {

    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
        throw new MyError(req.params.surveyId + " id тай судалгаа байхгүй!", 400);
    }

    if (survey.createdUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн судалгааны мэдээллийг засварлах боломжтой!", 400);
    }
    
    req.body.updatedUser = req.userId;

    // const task1 = await Task.findByIdAndUpdate(
    //    req.params.taskId,
    //    req.body,
    //    {
    //      new: true,
    //      runValidators: true,
    //    }
    // );

    for (let attr in req.body) {
        // console.log(attr);
        survey[attr] = req.body[attr];
    }

    // console.log(task);
    survey.save();

    res.status(200).json({
        success: true,
        data: survey,
    });
});

exports.deleteSurvey = asyncHandler(async (req, res, next) => {
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
        throw new MyError(req.params.surveyId + " id тай таск байхгүй!", 400);
    }

    if (survey.createdUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн таскын мэдээллийг устгах боломжтой!", 400);
    }

    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user === org;
    }

    survey.remove();

    res.status(200).json({  
        success: true,
        data: survey,
        deletedBy: user.name
    });

});

// PUT api/v1/surveys/:surveyId/photo
exports.uploadSurveyPhoto = asyncHandler(async (req, res, next) => {
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
        throw new MyError(req.params.surveyId + " id тай ном байхгүй ээ", 400);
    }

    const file = req.files.file;
    // image upload 
    if (!file.mimetype.startsWith("image")) {
        throw new MyError("Та зураг upload хийнэ үү.", 400);
    }

    if (file.size > process.env.MAX_UPLOAD_PHOTO_SIZE) {
        throw new MyError("Та зурагны хэмжээ хэт их байна", 400);
    }

    file.name = `photo-${req.params.surveyId}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if (err) {
            throw new MyError("Файл хуулах явцад алдаа гарлаа: " + err.message, 400);
        }

        survey.photo = file.name;
        survey.save();

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});

//      Тухайн судалгааны асуултуудыг буцаана.
//      app/v1/survey/:surveyId/questions
exports.getSurveyQuestions = asyncHandler(async (req, res, next) => {
    // console.log(req.params.taskId);
    const questions = await Question.find({surveyId: req.params.surveyId});

    if (!questions) {
        throw new MyError(req.params.surveyId + " id тай судалгаа үүсээгүй байна!", 400);
    }

    res.status(200).json({
        success: true,
        total: questions.length,
        data: questions,
    });
});
