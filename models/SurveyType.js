const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');
const SurveyTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Судалгааны төрлийн нэр оруулна уу!'],
        maxlength: [
            100, "Судалгааны төрлийн нэрийн урт дээд тал нь 100 тэмдэгт байх ёстой",
        ],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Судалгааны төрлийн тайлбарыг заавал оруулах ёстой."],
        maxlength: [500, "Судалгааны төрлийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

SurveyTypeSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

module.exports = mongoose.model("SurveyType", SurveyTypeSchema);