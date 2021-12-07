const express = require('express');
const {protect, authorize} = require('../middleware/protect');
const router = express.Router();

const {
    register,
    login,
    getOrganizations,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    createOrganization,
    forgotPassword,
    resetPassword,
} = require('../controller/organizations.js');

// const { getUserBooks } = require('../controller/books.js');
// const { getUserComments } = require('../controller/comments.js');

router.route("/register-org").post(register);
router.route("/login-org").post(login);
router.route("/forgot-password-org").post(forgotPassword);
router.route("/reset-password-org").post(resetPassword);

router.use(protect);

// http://localhost:8000/app/v1/organizations
router
    .route("/")
    .get(authorize("admin"), getOrganizations)
    .post(authorize("admin"), createOrganization);

router
    .route("/:organizationId")
    .get(getOrganization)
    .put(authorize("admin", "organization"), updateOrganization)
    .delete(authorize("admin"), deleteOrganization);

// router
//     .route("/:organizationId/books")
//     .get(authorize("admin", "operator", "user"), getUserBooks);

// router
//     .route("/:organizationId/tasks")
//     .get(getOrganizations);

module.exports = router;