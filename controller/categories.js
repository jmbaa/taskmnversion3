
const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");

exports.getCategories = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Category);

    console.log(req.query, sort, select, limit);
    const categories = await Category.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);
    res.status(200).json({
        success: true,
        data: categories,
        pagination,
    });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId).populate('books');
    //   const category = await Category.findById(req.params.categoryId);

    if (!category) {
        throw new MyError(req.params.categoryId + " id тай категори байхгүй ээ", 400);
    }

    //   category.name += "-";
    //   category.save(function(err){
    //       if(err) console.log("error : ", err);
    //     console.log("saved...");
    //   });

    res.status(200).json({
        success: true,
        data: category,
    });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const category = await Category.create(req.body);
    res.status(200).json({
        success: true,
        data: category,
    });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(
        req.params.categoryId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!category) {
        throw new MyError(req.params.categoryId + " id тай категори байхгүй ээ", 400);
    }

    res.status(200).json({
        success: true,
        data: category,
    });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        throw new MyError(req.params.categoryId + " id тай категори байхгүй ээ", 400);
    }

    category.remove();

    res.status(200).json({
        success: true,
        data: category,
    });

});

// PUT api/v1/categories/:categoryId/photo
exports.uploadCategoryPhoto = asyncHandler(async (req, res, next) => {
    console.log(req.params.categoryId);
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        throw new MyError(req.params.categoryId + " id тай категори байхгүй!", 400);
    }

    console.log(req.files);
    const file = req.files.image;

    // image upload 
    if (!file.mimetype.startsWith("image")) {
        throw new MyError("Та зураг upload хийнэ үү.", 400);
    }

    if (file.size > process.env.MAX_UPLOAD_PHOTO_SIZE) {
        throw new MyError("Та зурагны хэмжээ хэт их байна", 400);
    }

    file.name = `photo-${req.params.categoryId}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
        if (err) {
            throw new MyError("Файл хуулах явцад алдаа гарлаа: " + err.message, 400);
        }

        category.photo = file.name;
        category.save();

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
