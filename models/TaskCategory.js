const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');
const TaskCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Таск категорийн нэр оруулна уу'],
        trim: true,
        maxlength: [
            100,
            "Категорийн нэрийн урт дээд тал нь 100 тэмдэгт байх ёстой",
        ],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Категорийн тайлбарыг заавал оруулах ёстой."],
        maxlength: [500, "Категорийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

TaskCategorySchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

module.exports = mongoose.model("TaskCategory", TaskCategorySchema);