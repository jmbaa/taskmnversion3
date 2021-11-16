const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');
const AddressSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Аймаг эсвэл дүүргийн нэрийг оруулна уу'],
        trim: true
    },
    type:{
        type: String,
        enum: ['aimag', 'duureg'],
        required: [true, 'Тус хаяг аль төрөл нь вэ?']
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Аймаг эсвэл дүүргийн заавал оруулах ёстой."],
        maxlength: [500, "Аймаг эсвэл дүүргийн тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой."],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
  }, 
);

AddressSchema.pre('save', function(next) {
    // console.log("pre...", this.name);
    this.slug = slugify(this.name);
    next();
});

module.exports = mongoose.model("Address", AddressSchema);