const express = require('express');
const {protect, authorize} = require('../middleware/protect');

const {
    createComment,
    updateComment,
    deleteComment,
    getComments,
    getComment
} = require('../controller/comments.js');

const router = express.Router({
    mergeParams: true
});

//  app/v1/comments
router.route("/")
    .get(protect, authorize("admin", "operator", "user"), getComments)
    .post(protect, authorize("admin", "operator", "user"), createComment);

router.route("/:commentId")
    .get(getComment)
    .put(protect, authorize("admin", "operator", "user"), updateComment)
    .delete(protect, authorize("admin", "operator", "user"), deleteComment);

module.exports = router;