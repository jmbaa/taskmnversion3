const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    getQuestionTypes,
    getQuestionType,
    createQuestionType,
    updateQuestionType,
    deleteQuestionType
} = require('../controller/questionTypes.js');

//   /api/v1/task-categories/:id
router
    .route("/")
    .get(getQuestionTypes)
    .post(protect, authorize("admin"), createQuestionType);

router
    .route("/:questionTypeId")
    .get(getQuestionType)
    .put(protect, authorize("operator", "admin"), updateQuestionType)
    .delete(protect, authorize("admin"), deleteQuestionType);

module.exports = router;