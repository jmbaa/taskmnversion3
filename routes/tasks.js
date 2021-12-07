const express = require('express');
const {protect, authorize} = require('../middleware/protect');

const {
    getTasks,
    getTask,
    updateTask,
    createTask,
    deleteTask,
    uploadTaskPhoto,
    getTaskBids
} = require('../controller/tasks.js'); 

const {
    getBid,
    updateBid,
    createBid,
    deleteBid
} = require('../controller/bids.js'); 

const router = express.Router({
    mergeParams: true
});

router.route("/").get(getTasks).post(protect, authorize("admin", "operator", "organization", "user"), createTask);

// router.user(prote)

router
    .route("/:taskId")
    .get(getTask)
    .put(protect, authorize("user", "operator", "admin", "organization"), updateTask)
    .delete(protect, authorize("admin", "operator", "organization"), deleteTask);

router
    .route("/:taskId/photo")
    .put(protect, authorize("operator", "user", "admin"), uploadTaskPhoto);

router
    .route("/:taskId/bids")
    .get(getTaskBids)
    .post(protect, authorize("operator", "user", "admin", "organization"), createBid);

router
    .route("/:taskId/bids/:bidId")
    .get(getBid)
    .put(protect, authorize("operator", "user", "admin", "organization"), updateBid)
    .delete(protect, authorize("operator", "user", "admin", "organization"), deleteBid);

module.exports = router;