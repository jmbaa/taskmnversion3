const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser,
    forgotPassword,
    resetPassword,
} = require('../controller/users.js');

const { getUserBooks } = require('../controller/books.js');
const { getUserComments } = require('../controller/comments.js');


// http://localhost:8000/app/v1/users

router.route("/").get(getUsers).post(createUser);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);


router.use(protect);

router
    .route("/:userId")
    .get(authorize("admin", "operator"), getUser)
    .put(authorize("admin"), updateUser)
    .delete(authorize("admin"), deleteUser);

router
    .route("/:userId/books")
    .get(authorize("admin", "operator", "user"), getUserBooks);

router
    .route("/:userId/comments")
    .get(getUserComments);

module.exports = router;