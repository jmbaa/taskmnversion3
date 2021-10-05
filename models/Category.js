const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');
const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Категорийн нэрийг оруулна уу'],
        unique: true,
        trim: true,
        min: [5, "Категорийн урт хамгийн багадаа 5 тэмдэгт байх ёстой"],
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
    photo: {
        type: String,
        default: "no-photo.jpg",
    },

    averageRating: {
        type: Number,
        min: [1, "Рейтинг хамгийн багадаа 1 байх ёстой"],
        max: [10, "Рейтинг хамгийн ихдээ 10 байх ёстой"],
    },

    averagePrice: Number,

    createdAt: {
        type: Date,
        default: Date.now,
    },
},  {toJSON: {virtuals: true}, 
    toObject: {virtuals: true}}
);

CategorySchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});

CategorySchema.pre('save', function(next) {
    // console.log("pre...", this.name);

    this.slug = slugify(this.name);
    next();
});

CategorySchema.pre('remove', async function(next) {
    console.log('removing');
    await this.model('Book').deleteMany({category: this._id});
    next();
});


module.exports = mongoose.model("Category", CategorySchema);