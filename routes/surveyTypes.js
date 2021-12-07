const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    getSurveyTypes,
    getSurveyType,
    createSurveyType,
    updateSurveyType,
    deleteSurveyType
} = require('../controller/surveyTypes.js');

const {
    getSurveysByType
} = require('../controller/surveys.js');

//   /api/v1/task-categories/:id
router
    .route("/")
    .get(getSurveyTypes)
    .post(protect, authorize("admin"), createSurveyType);

router
    .route("/:surveyTypeId")
    .get(getSurveyType)
    .put(protect, authorize("operator", "admin"), updateSurveyType)
    .delete(protect, authorize("admin"), deleteSurveyType);

router
    .route("/:surveyTypeId/surveys")
    .get(getSurveysByType)

module.exports = router;