const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');

const BidSchema = new mongoose.Schema({
    bidUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Task',
        required: true,
    },
    description:{
        type: String,
        required: [true, 'Тус ажлын үнийн саналын талаар дэлгэрэнгүй мэдэээл оруулна уу!'],
        min: [100, "Тус ажлын үнийн саналын тайлбар хамгийн багадаа 100 тэмдэгт байх ёстой"],
        maxlength: [
            1000,
            "Тус ажлын үнийн саналын тайлбар дээд тал нь 1000 тэмдэгт байх ёстой",
        ],
    },
    amount:{
        type: Number,
        required: [true, 'Үнийн санал оруулна уу!'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, "Тус ажлыг гүйцэтгэж эхлэх огноог оруулна уу!"]
    },
    endDate: {
        type: String,
        required: [true, "Тус ажлыг гүйцэтгэж дуусгах огноог оруулна уу!"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },  
  }, 
);

module.exports = mongoose.model("Bid", BidSchema);