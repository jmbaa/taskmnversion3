// Ашиглаж буй сангууд болон ашиглаж буй функцууд
const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");
const User = require("../models/User");
const sendEmail = require("../utils/email")
const crypto = require('crypto');

// Бүртгэл үүсгэж буй хэсэг
exports.register = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body);

    const jwt = user.getJWT();

    res.status(200).json({
        success: true,
        jwt,
        user: user,
    });
});

//  do login 
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    //  оролтыг шалгах
    if (!email || !password) {
        throw new MyError('Цахим хаяг болон нууц үгээ дамжуулна уу', 400);
    }

    // Тухайн хэрэглэгч байгаа эсэхийг шалгана
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    }

    const ok = await user.checkPassword(password);

    if (!ok) {
        throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    }               

    res.status(200).json({
        success: true,
        token: user.getJWT(),
        user: user,
    });
});

//  do logout
exports.logout = asyncHandler(async (req, res, next) => {
    console.log("end shajiiin")
    // Тухайн хэрэглэгч байгаа эсэхийг шалгана
    const user = await User.findById(req.userId);
    res.status(200).json({
        success: true,
        // token: user.getJWT(),
        user: user,
    });
    // if (!user) {
    //     throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    // }

    // const ok = await user.checkPassword(password);

    // if (!ok) {
    //     throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    // }               

    res.status(200).json({
        success: true,
        // token: user.getJWT(),
        // user: user,
    });
});

exports.getUsers = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, User);

    console.log(req.query, sort, select, limit);
    const users = await User.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: users,
    });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        throw new MyError(req.params.userId + " id-тай хэрэглэгч байхгүй ээ", 400);
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.createUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const user = await User.create(req.body);
    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        throw new MyError(req.params.userId + " id-тай хэрэглэгч байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        throw new MyError(req.params.userId + " id-тай хэрэглэгч байхгүй!", 400);
    }

    user.remove();

    res.status(200).json({
        success: true,
        data: user,
    });

});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // console.log(req.body.email);
    if (!req.body.email) {
        throw new MyError("Та нууц үгээ сэргээхийн тулд бүртгэлтэй цахим хаягаа оруулна уу!", 400);
    }

    const user = await User.findOne({ email: req.body.email });

    console.log(user);
    if (!user) {
        throw new MyError(req.body.email + "цахим хаягтай хэрэглэгч олдсонгүй!", 400);
    }

    const resetToken = user.generatePasswordChangeToken();

    await user.save();

    const link = `http://localhost:8000/changepassword/${resetToken}`;

    const message = `Сайн байна уу та нууц үгээ солих хүсэлт илгээлээ.  <br> 
                    Нууц үгээ доорхи линк дээр дарж солино уу: 
                    
                      <br><br>
                        <a href="${link}">ЭНД ДАРНА УУ</a>
                      <br><br>
                      
                    Өдрийг сайхан өнгөрүүлээрэй!`;

    // Цахим шуудан илгээх
    await sendEmail({
        email: user.email,
        subject: 'Нууц үг өөрчлөх хүсэлт',
        message,
    });

    res.status(200).json({
        success: true,
        resetToken,
    });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    // console.log(req.body.email);
    if (!req.body.resetToken || !req.body.password) {
        throw new MyError("Та токен болон нууц үгээ дамжуулна уу!", 400);
    }

    const encrypted = crypto
        .createHash('sha256')
        .update(req.body.resetToken)
        .digest("hex");


    const user = await User.findOne({
        resetPasswordToken: encrypted,
        resetPasswordExpired: { $gt: Date.now() },
    });

    console.log(user);
    if (!user) {
        throw new MyError("Хүчингүй токен байна.", 400);
    }

    const resetToken = user.generatePasswordChangeToken();

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    await user.save();

    const token = user.getJWT();

    res.status(200).json({
        success: true,
        token,
        user: user,
    });
});