const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');
const QuestionTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Асуултын төрлийн нэр оруулна уу!'],
        maxlength: [
            100, "Асуултын төрлийн нэрийн урт дээд тал нь 100 тэмдэгт байх ёстой",
        ],
    },
    description: {
        type: String,
        required: [true, "Асуултын төрлийн тайлбарыг заавал оруулах ёстой."],
        maxlength: [500, "Асуултын төрлийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("QuestionType", QuestionTypeSchema);