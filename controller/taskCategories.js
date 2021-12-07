const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");
const TaskCategory = require("../models/TaskCategory");

exports.getTaskCategories = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, TaskCategory);

    console.log(req.query, sort, select, limit);
    const taskCategories = await TaskCategory.find()
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);
    res.status(200).json({
        success: true,
        pagination,
        data: taskCategories,
    });
});

exports.getTaskCategory = asyncHandler(async (req, res, next) => {
    const taskCategory = await TaskCategory.findById(req.params.taskCategoryId);

    if (!taskCategory) {
        throw new MyError(req.params.taskCategoryId + " id тай категори байхгүй ээ", 400);
    }

    res.status(200).json({
        success: true,
        data: taskCategory,
    });
});

exports.createTaskCategory = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const taskCategory = await TaskCategory.create(req.body);
    res.status(200).json({
        success: true,
        data: taskCategory,
    });
});

exports.updateTaskCategory = asyncHandler(async (req, res, next) => {
    const taskCategory = await TaskCategory.findByIdAndUpdate(
        req.params.taskCategoryId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!taskCategory) {
        throw new MyError(req.params.taskCategoryId + " id тай категори байхгүй ээ", 400);
    }

    res.status(200).json({
        success: true,
        data: taskCategory,
    });
});

exports.deleteTaskCategory = asyncHandler(async (req, res, next) => {
    const taskCategory = await TaskCategory.findById(req.params.taskCategoryId);
    if (!taskCategory) {
        throw new MyError(req.params.taskCategoryId + " id тай категори байхгүй ээ", 400);
    }

    taskCategory.remove();

    res.status(200).json({
        success: true,
        data: taskCategory,
    });

});