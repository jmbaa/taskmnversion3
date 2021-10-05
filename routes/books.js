const express = require('express');
const {protect, authorize} = require('../middleware/protect');

const {
    getBooks,
    getBook,
    updateBook,
    createBook,
    deleteBook,
    uploadBookPhoto
} = require('../controller/books.js'); 

const {
    getBookComments
} = require('../controller/comments.js');

const router = express.Router({
    mergeParams: true
});

router.route("/").get(getBooks).post(protect, authorize("admin", "operator"), createBook);

router
    .route("/:bookId")
    .get(getBook)
    .put(protect, authorize("operator", "admin"), updateBook)
    .delete(protect, authorize("admin", "operator"), deleteBook);

router
    .route("/:bookId/photo")
    .put(protect, authorize("operator"), uploadBookPhoto);

router
    .route("/:bookId/comments")
    .get(getBookComments);

module.exports = router;