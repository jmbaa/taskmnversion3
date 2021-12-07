const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");
const SurveyType = require("../models/SurveyType.js");

exports.getSurveyTypes = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, SurveyType);

    // console.log(req.query, sort, select, limit);
    const surveyTypes = await SurveyType.find()
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: surveyTypes,
    });
});

exports.getSurveyType = asyncHandler(async (req, res, next) => {
    const surveyType = await SurveyType.findById(req.params.surveyTypeId);

    if (!surveyType) {
        throw new MyError(req.params.surveyTypeId + " id-тай судалгааны төрөл байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: surveyType,
    });
});

exports.createSurveyType = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const surveyType = await SurveyType.create(req.body);
    res.status(200).json({
        success: true,
        data: surveyType,
    });
});

exports.updateSurveyType = asyncHandler(async (req, res, next) => {
    const surveyType = await SurveyType.findByIdAndUpdate(
        req.params.surveyTypeId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!surveyType) {
        throw new MyError(req.params.surveyTypeId + " id-тай судалгааны төрөл байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: surveyType,
    });
});

exports.deleteSurveyType = asyncHandler(async (req, res, next) => {
    const surveyType = await SurveyType.findById(req.params.surveyTypeId);
    if (!surveyType) {
        throw new MyError(req.params.surveyTypeId + " id-тай судалгааны төрөл байхгүй!", 400);
    }

    surveyType.remove();

    res.status(200).json({
        success: true,
        data: surveyType,
    });

});