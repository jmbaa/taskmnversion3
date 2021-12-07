const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');

const SurveySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Судалгааны нэрийг оруулна уу'],
        min: [5, "Судалгааны урт хамгийн багадаа 5 тэмдэгт байх ёстой"],
        maxlength: [
            300,
            "Судалгааны нэрийн урт дээд тал нь 300 тэмдэгт байх ёстой",
        ],
    },
    description:{
        type: String,
        required: [true, 'Судалгааны тайлбар оруулна уу'],
        min: [5, "Судалгааны тайлбарын урт хамгийн багадаа 5 тэмдэгт байх ёстой"],
        maxlength: [
            500,
            "Судалгааны тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой",
        ],
    },
    createdUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    createdOrganizationId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Organization',
    },
    surveyType: {
        type: mongoose.Schema.ObjectId,
        ref: 'SurveyType',
    },
    ageStart: {
        type: Number,
        required: [true, "Насны доод хязгаар оруулах"],
        min: [16, "Насны доод хязгаар хамгийн багадаа 16 байх ёстой"],
    },
    ageEnd: {
        type: Number,
        required: [true, "Насны дээд хязгаар оруулах"],
        max: [120, "Насны дээд хязгаар хамгийн ихдээ 120 байх ёстой"],
    },
    beAddress: {
        type: String,
        required: [true, "Номын тайлбарыг оруулна уу!"],
        trim: true,
        maxlength: [5000, "Номын нэрний урт дээд талдаа 20 тэмдэгт байна."],
    },
    beGender: {
        type: Boolean,
        default: false,
    },
    deadline: {
        type: Date,
        required: [true, "Тус судалгаа авч дуусах хугацааг оруулна уу!"],
    },  
    beCount: {
        type: Number,
        required: [true, "Хамгийн ихдээ нийт хичнээн хүнээс уг судалгааг авах вэ?"],
    },  
    pricePerUser: {
        type: Number,
        required: [true, "Тус судалгааг бөглөхөд нэг хүнд олгогдох мөнгөн дүнг оруулна уу!"],
    },
    available: Boolean,
    isPaid: Boolean,
    createdAt: {
        type: Date,
        default: Date.now,
    },  
  },    {toJSON:{virtuals: true}, toObject:{ virtuals: true}}
);

SurveySchema.virtual('totalPrice').get(function(){
    return this.pricePerUser * this.beCount;
});

module.exports = mongoose.model("Survey", SurveySchema);