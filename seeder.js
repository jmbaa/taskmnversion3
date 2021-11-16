const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Book = require("./models/Book");
const User = require("./models/User");
const Bid = require("./models/Bid");
const Address = require("./models/Address");
const Organization = require('./models/Organization');
const TaskCategory = require("./models/TaskCategory");
const Task = require('./models/Task');
const SurveyType = require('./models/SurveyType');
const Survey = require('./models/Survey');
const QuestionType = require('./models/QuestionType');
const Question = require('./models/Question');
const Answer = require('./models/Answers');

dotenv.config({path: './config/config.env'});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

const address = JSON.parse(
    fs.readFileSync(__dirname + '/data/address.json', 'utf-8')
);

const organizations = JSON.parse(
    fs.readFileSync(__dirname + '/data/organization.json', 'utf-8')
);

const bids = JSON.parse(
    fs.readFileSync(__dirname + '/data/bid.json', 'utf-8')
);

const taskCategories = JSON.parse(
    fs.readFileSync(__dirname + '/data/taskCategory.json', 'utf-8')
);

const books = JSON.parse(
    fs.readFileSync(__dirname + '/data/book.json', 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(__dirname + '/data/user.json', 'utf-8')
);

const tasks = JSON.parse(
    fs.readFileSync(__dirname + '/data/task.json', 'utf-8')
);

const surveyType = JSON.parse(
    fs.readFileSync(__dirname + '/data/surveyType.json', 'utf-8')
);

const survey = JSON.parse(
    fs.readFileSync(__dirname + '/data/survey.json', 'utf-8')
);

const questionType = JSON.parse(
    fs.readFileSync(__dirname + '/data/questionType.json', 'utf-8')
);

const question = JSON.parse(
    fs.readFileSync(__dirname + '/data/question.json', 'utf-8')
);

const answer = JSON.parse(
    fs.readFileSync(__dirname + '/data/answer.json', 'utf-8')
);


const importData = async () => {    
    try{
        await Address.create(address);
        await TaskCategory.create(taskCategories);
        await User.create(users);
        await Organization.create(organizations);
        await Task.create(tasks);
        await Bid.create(bids);
        await SurveyType.create(surveyType);
        await Survey.create(survey);
        await QuestionType.create(questionType);
        await Question.create(question);
        await Answer.create(answer);
        console.log("Өгөгдлийг дүүргэлээ");
    }catch (err){
        console.log(err.message);
    }
}

const deleteData = async () => {
    try{
        await Address.deleteMany();
        await TaskCategory.deleteMany();
        await User.deleteMany();
        await Organization.deleteMany();
        await Task.deleteMany();
        await Bid.deleteMany();
        await SurveyType.deleteMany();
        await Survey.deleteMany();
        await QuestionType.deleteMany();
        await Question.deleteMany();
        await Answer.deleteMany();
        console.log("Өгөгдлийг устгалаа");
    } catch(err){
        console.log(err.message);
    }
};

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}