const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    surveyId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Survey',
    },
    questionTypeId:{
        type: mongoose.Schema.ObjectId,
        ref: 'QuestionType',
    },
    question: {
        type: String,
        required: [true, 'Асуултаа оруулна уу!'],
    },
    possibleAnswers: {
        type: [String],
        required: [true, "Асуултын хариултуудыг оруулах"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },  
  },    {toJSON:{virtuals: true}, toObject:{ virtuals: true}}
);

module.exports = mongoose.model("Question", QuestionSchema);