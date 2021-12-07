const express = require('express');
const {protect, authorize} = require('../middleware/protect');

const {
    getSurveys,
    getSurvey,
    updateSurvey,
    createSurvey,
    deleteSurvey,
    uploadSurveyPhoto,
    getSurveyQuestions
} = require('../controller/surveys.js'); 

const {
    getQuestion,
    updateQuestion,
    createQuestion,
    deleteQuestion
} = require('../controller/questions.js'); 

const {
    getAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer
} = require('../controller/answers.js'); 

const router = express.Router({
    mergeParams: true
});

router
    .route("/")
    .get(getSurveys)
    .post(protect, authorize("admin", "operator", "organization", "user"), createSurvey);

// router.user(prote)

router
    .route("/:surveyId")
    .get(getSurvey)
    .put(protect, authorize("user", "operator", "admin", "organization"), updateSurvey)
    .delete(protect, authorize("admin", "operator", "organization"), deleteSurvey);

router
    .route("/:surveyId/photo")
    .put(protect, authorize("operator", "user", "admin"), uploadSurveyPhoto);

router
    .route("/:surveyId/questions")
    .get(getSurveyQuestions)
    .post(protect, authorize("operator", "user", "admin", "organization"), createQuestion);

router
    .route("/:surveyId/questions/:questionId")
    .get(getQuestion)
    .put(protect, authorize("operator", "user", "admin", "organization"), updateQuestion)
    .delete(protect, authorize("operator", "user", "admin", "organization"), deleteQuestion);

router
    .route("/:surveyId/questions/:questionId/answers")
    .get(protect, authorize("operator", "user", "admin"), getAnswers)
    .post(protect, authorize("operator", "user", "admin", "organization"), createAnswer);
router
    .route("/:surveyId/questions/:questionId/answers/:answerId")
    .put(protect, authorize("operator", "user", "admin", "organization"), updateAnswer)
    .delete(protect, authorize("operator", "user", "admin", "organization"), deleteAnswer);

module.exports = router;