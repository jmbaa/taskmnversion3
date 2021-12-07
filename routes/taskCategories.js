const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    getTaskCategories,
    getTaskCategory,
    createTaskCategory,
    updateTaskCategory,
    deleteTaskCategory
} = require('../controller/taskCategories.js');

const {
    getTasksByCategory
} = require('../controller/tasks.js');

//   /api/v1/categories/:taskCategoryId/tasks
router.use("/:taskCategoryId/tasks", getTasksByCategory);

//   /api/v1/task-categories/:id
router.route("/").get(getTaskCategories).post(protect, authorize("admin"), createTaskCategory);

router
    .route("/:taskCategoryId")
    .get(getTaskCategory)
    .put(protect, authorize("operator", "admin"), updateTaskCategory)
    .delete(protect, authorize("admin"), deleteTaskCategory);

module.exports = router;