const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryPhoto,
} = require('../controller/categories.js');

const {
    getCategoryBooks
} = require('../controller/books.js');

//       /api/v1/categories /:id/books
router.use("/:categoryId/books", getCategoryBooks)

//       /api/v1/categories/:id
router.route("/").get(getCategories).post(protect, authorize("admin"), createCategory);

router
    .route("/:categoryId")
    .get(getCategory)
    .put(protect, authorize("operator"), updateCategory)
    .delete(protect, authorize("admin"), deleteCategory);

router
    .route("/:categoryId/photo")
    .put(protect, authorize("operator"), uploadCategoryPhoto);

module.exports = router;