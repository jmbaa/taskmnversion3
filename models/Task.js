const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Таскын нэр оруулна уу'],
    },
    createdUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    selectedBid: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bid',
        default: null
    },
    taskCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'TaskCategory',
        required: true,
    },
    status: {   
        type: String,
        required: [true, 'Статусыг оруулна уу'],
        enum: ['unpaid', 'active', 'cancelled', 'confirmed', 'unfinished', 'finished']
    },
    description:{
        type: String,
        required: [true, 'Тус ажлын талаар дэлгэрэнгүй мэдэээл оруулна уу!'],
        min: [200, "Ажлын тайлбар хамгийн багадаа 200 тэмдэгт байх ёстой"],
        maxlength: [
            1000,
            "Ажлын тайлбар дээд тал нь 1000 тэмдэгт байх ёстой",
        ],
    },
    needskills: {
        type: Array,
        default: []
    },
    startPrice: {
        type: Number,
        required: [true, 'Тус ажлын эхлэх үнийн санал оруулна уу!']
    },
    endPrice: {
        type: Number,
        required: [true, 'Тус ажлын хамгийн ихдээ олгох үнийн санал оруулна уу!']
    },
    startDate: {
        type: Date,
        required: [true, 'Тус ажлыг гүйцэтгэж эхлэх огноо']
    },
    endDate: {   
        type: Date,
        required: [true, 'Тус ажлыг гүйцэтгэж дуусгах огноо']
    },
    updatedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },  
  },
);

module.exports = mongoose.model("Task", TaskSchema);