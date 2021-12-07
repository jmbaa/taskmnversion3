const Bid = require('../models/Bid');
const User = require('../models/User');
const Organization = require('../models/Organization');
const TaskCategory = require('../models/TaskCategory');
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const path = require('path');
const paginate = require("../utils/paginate");

exports.getBid = asyncHandler(async (req, res, next) => {
    //   const category = await Category.findById(req.params.bookId).populate('books');
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
        throw new MyError(req.params.bidId + "-id тай үнийн санал байхгүй!", 400);
    }

    res.status(200).json({
        success: true,
        data: bid,
    });
});

exports.createBid = asyncHandler(async (req, res, next) => {
    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    req.body.taskId = req.params.taskId;
    req.body.bidUserId = user.id;

    const bid = await Bid.create(req.body);

    res.status(200).json({
        success: true,
        data: bid,
    });
});

exports.updateBid = asyncHandler(async (req, res, next) => {

    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
        throw new MyError(req.params.bidId + " id-тай үнийн санал байхгүй!", 400);
    }

    if (bid.bidUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн үнийн саналыг засварлах боломжтой!", 400);
    }
    
    req.body.bidUserId = req.userId;

    for (let attr in req.body) {
        // console.log(attr);
        bid[attr] = req.body[attr];
    }
    
    bid.save();

    res.status(200).json({
        success: true,
        data: bid,
    });
});

exports.deleteBid = asyncHandler(async (req, res, next) => {
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
        throw new MyError(req.params.bidId+ " id-тай үнийн санал байхгүй!", 400);
    }

    if (bid.bidUserId.toString() !== req.userId && req.userRole !== 'admin') {
        throw new MyError("Та зөвхөн өөрийн үүсгэсэн үнийн саналыг устгах боломжтой!", 400);
    }

    var user = await User.findById(req.userId);

    if (!user) {
        const org = await Organization.findById(req.userId);
        if (!org) {
            throw new MyError(req.userId + " id-тай хэрэглэгч эсвэл байгууллага олдсонгүй", 400);
        }

        user = org;
    }

    bid.remove();

    res.status(200).json({
        success: true,
        data: bid,
        deletedBy: user
    });

});
