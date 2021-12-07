const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const MyError = require('../utils/myError');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    
    if(!req.headers.authorization){
        throw new MyError('Энэ үйлдлийн хийхэд таны эрх хүрэхгүй байна. Та нэвтрэнэ үү. Auth header token байхгүй байна.',
            401
        );
    } 

    const token = req.headers.authorization.split(' ')[1];

    if(!token){
        throw new MyError('Токен байхгүй байна. ',
            400
        );
    }

    const tokenObj = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenObj.id;
        req.userRole = tokenObj.role;
    next();
});

exports.authorize = (...roles) => {
    return (req, res, next) => {

        if(!roles.includes(req.userRole)){
            throw new MyError(
                `Таны ${req.userRole} эрх хүрэлцэхгүй байна.`,
                403
            );
        }

        next();
    };
}