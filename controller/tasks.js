const Task = require('../models/Task');
const User = require('../models/User');
const Bid = require('../models/Bid');
const Organization = require('../models/Organization');
const TaskCategory = require('../models/TaskCategory');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");


// app/v1/tasks ~ таскын жагсаалт авна.
exports.getTasks = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Хуудаслалт
    const pagination = await paginate(page, limit, Task);

    const tasks = await Task.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    // Хариу
    res.status(200).json({
        success: true,
        pagination,
        data: tasks,
    });
});


// app/v1/task-categories/:catId/tasks ~ Тухайн ангилалын таскууд
exports.getTasksByCategory = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Хуудаслалт
    const pagination = await paginate(page, limit, Task);

    const tasks = await Task.find({...req.query, taskCategory: req.params.taskCategoryId }, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: tasks.length,
        pagination,
        data: tasks,
    });
});

exports.getTask = asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const task = await Task.findById(req.params.taskId);

    if (!task) {
        throw new MyError(req.params.taskId + "-id тай таск байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: task,
    });
});

exports.createTask = asyncHandler(async (req, res, next) => {

    console.log(req.body);

    const taskCategory = await TaskCategory.findById(req.body.taskCategory);

    if (!taskCategory) {
        throw new MyError(req.body.taskCategoryId + " id-тай таск категори байхгүй!", 400);
    }

    req.body.createdUser = req.userId;
    const task = await Task.create(req.body);

    res.status(200).json({
        success: true,
        data: task,
    });
});

exports.updateTask = asyncHandler(async (req, res, next) => {

    const task = await Task.findById(req.params.taskId);

    if (!task) {
        throw new MyError(req.params.taskId + " id тай ном байхгүй ээ", 400);
    }

    if (task.createdUser.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн таскын мэдээллийг засварлах боломжтой!", 400);
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
        task[attr] = req.body[attr];
    }

    // console.log(task);
    task.save();

    res.status(200).json({
        success: true,
        data: task,
    });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
        throw new MyError(req.params.taskId + " id тай таск байхгүй!", 400);
    }

    if (task.createdUser.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн таскын мэдээллийг устгах боломжтой!", 400);
    }

    const user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user === org;
    }

    task.remove();

    res.status(200).json({
        success: true,
        data: task,
        deletedBy: user.name
    });

});

// PUT api/v1/books/:bookId/photo
exports.uploadTaskPhoto = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
        throw new MyError(req.params.taskId + " id тай ном байхгүй ээ", 400);
    }

    const file = req.files.file;
    // image upload 
    if (!file.mimetype.startsWith("image")) {
        throw new MyError("Та зураг upload хийнэ үү.", 400);
    }

    if (file.size > process.env.MAX_UPLOAD_PHOTO_SIZE) {
        throw new MyError("Та зурагны хэмжээ хэт их байна", 400);
    }

    file.name = `photo-${req.params.taskId}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if (err) {
            throw new MyError("Файл хуулах явцад алдаа гарлаа: " + err.message, 400);
        }

        task.photo = file.name;
        taskCategoryId.save();

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});

//      Тухайн хүний 
//      app/v1/tasks
exports.getUserTasks = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Task);

    req.query.createdUser = req.userId;

    // console.log(req.query);

    const tasks = await Task.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: tasks.length,
        pagination,
        data: tasks,
    });
});

//      Тухайн таскын үнийн саналууд
//      app/v1/tasks/:taskId/bids
exports.getTaskBids = asyncHandler(async (req, res, next) => {
    // console.log(req.params.taskId);
    const bids = await Bid.find({taskId: req.params.taskId});

    if (!bids) {
        throw new MyError(req.params.taskId + " id тай таскед үнийн санал үүсээгүй байна!", 400);
    }

    res.status(200).json({
        success: true,
        total: bids.length,
        data: bids,
    });
});
