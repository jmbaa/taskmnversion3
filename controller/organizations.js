const MyError = require("../utils/myError");
const asyncHandler = require('express-async-handler');
const path = require('path');
const paginate = require("../utils/paginate");
const Organization = require("../models/Organization");
const sendEmail = require("../utils/email");
const crypto = require('crypto');

// Байгууллагын бүртгэл үүсгэж буй хэсэг
exports.register = asyncHandler(async (req, res, next) => {

    const organization = await Organization.create(req.body);

    const jwt = organization.getOrgJWT();

    res.status(200).json({
        success: true,
        jwt,
        organization: organization,
    });
});

//  Байгууллага нэвтрэх хэсэг
exports.login = asyncHandler(async (req, res, next) => {

    const { regNumber, password } = req.body;
    // console.log(req.body);

    //  Оролтыг шалгах
    if (!regNumber || !password) {
        throw new MyError('Цахим хаяг болон нууц үгээ оруулна уу!', 400);
    }

    // Тухайн байгууллага байгаа эсэхийг шалгана
    const organization = await Organization.findOne({ regNumber }).select('+password');

    if (!organization) {
        throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    }

    const ok = await organization.checkPassword(password);

    if (!ok) {
        throw new MyError('Цахим хаяг эсвэл нууц үгээ зөв оруулна уу', 401);
    }

    res.status(200).json({
        success: true,
        token: organization.getOrgJWT(),
        user: organization,
    });
});


exports.getOrganizations = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const select = req.query.select;
    const sort = req.query.sort;

    ['select', 'sort', 'page', 'limit'].forEach(el => delete req.query[el]);

    // Pagination
    const pagination = await paginate(page, limit, Organization);

    console.log(req.query, sort, select, limit);
    const organizations = await Organization.find(req.query, select)
        .sort(sort)
        .skip(pagination.start - 1)
        .limit(limit);

    res.status(200).json({
        success: true,
        pagination,
        data: organizations,
    });
});

exports.getOrganization = asyncHandler(async (req, res, next) => {
    const organization = await Organization.findById(req.params.organizationId);

    if (!organization) {
        throw new MyError(req.params.organizationId + " id-тай байгууллага байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: organization,
    });
});

exports.createOrganization = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const organization = await Organization.create(req.body);
    res.status(200).json({
        success: true,
        data: organization,
    });
});

exports.updateOrganization = asyncHandler(async (req, res, next) => {
    const organization = await Organization.findByIdAndUpdate(
        req.params.organizationId,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!organization) {
        throw new MyError(req.params.organizationId + " id-тай байгууллага байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: organization,
    });
});

exports.deleteOrganization = asyncHandler(async (req, res, next) => {
    const organization = await Organization.findById(req.params.userId);

    if (!organization) {
        throw new MyError(req.params.organizationId + " id-тай хэрэглэгч байхгүй!", 400);
    }

    organization.remove();

    res.status(200).json({
        success: true,
        data: organization,
    });

});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // console.log(req.body.email);
    if (!req.body.email) {
        throw new MyError("Та нууц үгээ сэргээхийн тулд бүртгэлтэй цахим хаягаа оруулна уу!", 400);
    }

    const organization = await Organization.findOne({ email: req.body.email });

    console.log(organization);
    if (!organization) {
        throw new MyError(req.body.email + "цахим хаягтай байгууллага олдсонгүй!", 400);
    }

    const resetToken = organization.generatePasswordChangeToken();

    await organization.save();

    const link = `http://localhost:8000/changepassword/${resetToken}`;

    const message = `Сайн байна уу та нууц үгээ солих хүсэлт илгээлээ.  <br> 
                    Нууц үгээ доорхи линк дээр дарж солино уу: 
                    
                      <br><br>
                        <a href="${link}">ЭНД ДАРНА УУ</a>
                      <br><br>
                      
                    Өдрийг сайхан өнгөрүүлээрэй!`;

    // Цахим шуудан илгээх
    await sendEmail({
        email: organization.email,
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


    const organization = await Organization.findOne({
        resetPasswordToken: encrypted,
        resetPasswordExpired: { $gt: Date.now() },
    });

    console.log(Organization);
    if (!organization) {
        throw new MyError("Хүчингүй токен байна.", 400);
    }

    const resetToken = Organization.generatePasswordChangeToken();

    organization.password = req.body.password;
    organization.resetPasswordToken = undefined;
    organization.resetPasswordExpired = undefined;
    await organization.save();

    const token = organization.getOrgJWT();

    res.status(200).json({
        success: true,
        token,
        organization: organization,
    });
}); 