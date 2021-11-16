const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');

const BookSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Номын нэрийг оруулна уу'],
        unique: true,
        trim: true,
        min: [5, "Номын урт хамгийн багадаа 5 тэмдэгт байх ёстой"],
        maxlength: [
            200,
            "Номын нэрийн урт дээд тал нь 200 тэмдэгт байх ёстой",
        ],
    },
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    author:{
        type: String,
        required: [true, 'Зохиогчийн нэрийг оруулна уу'],
        trim: true,
        min: [2, "Зохиогыийн нэрийн урт хамгийн багадаа 2 тэмдэгт байх ёстой"],
        maxlength: [
            200,
            "Зохиогчийн нэрийн урт дээд тал нь 200 тэмдэгт байх ёстой",
        ],
    },
    price: {
        type: String,
        required: [true, "Номын үнийг оруулна уу!"],
        min: [500, "Номын үнэ хамгийн багадаа 500 төгрөг байх"],
    },

    content: {
        type: String,
        required: [true, "Номын тайлбарыг оруулна уу!"],
        trim: true,
        maxlength: [5000, "Номын нэрний урт дээд талдаа 20 тэмдэгт байна."],
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    available: [String],

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
    },

    createdUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    updatedUser: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },


    createdAt: {
        type: Date,
        default: Date.now,
    },  
  },    {toJSON:{virtuals: true}, toObject:{ virtuals: true}}
);

BookSchema.statics.computerCategoryAveragePrice = async function (catId){
    const obj = await this.aggregate([
        { $match: {category: catId} },
        { $group: { _id: '$category', avgPrice: { $avg: "$price" }}},
    ]);


    console.log(obj);
    let avgPrice = null;


    if(obj.length > 0) avgPrice = obj[0].avgPrice;
    await this.model('Category').findByIdAndUpdate(
        catId, 
        {
            averagePrice: avgPrice,
        }
    );

    return obj;
};

BookSchema.post('save', function() {
    this.constructor.computerCategoryAveragePrice(this.category);
});

BookSchema.post('remove', function() {
    this.constructor.computerCategoryAveragePrice(this.category);
});

BookSchema.virtual('zohiogch').get(function(){

    if(!this.author) return "";
 
    let tokens = this.author.split(" ");
    
    if(tokens.length === 1) tokens = this.author.split(".");
    if(tokens.length === 2) return tokens[1];

    return tokens[0];
});

module.exports = mongoose.model("Book", BookSchema);