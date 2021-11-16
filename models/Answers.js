const mongoose = require("mongoose");
const { transliterate, slugify } = require('transliteration');

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true,
    },

    answeredUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    answers: {
        type: [String]
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },  
  },    {toJSON:{virtuals: true}, toObject:{ virtuals: true}}
);

module.exports = mongoose.model("Answer", AnswerSchema);