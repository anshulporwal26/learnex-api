const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");
const middlewares = require("../middlewares");

router.post(
  "/roadmaps/:roadmapId/enroll",
  middlewares.checkAuth,
  enrollmentController.enroll
);
router.delete(
  "/roadmaps/:roadmapId/enrollments/:enrollmentId/leave",
  middlewares.checkAuth,
  enrollmentController.leaveRoadmap
);
router.put(
  "/roadmaps/:roadmapId/enrollments/:enrollmentId/complete",
  middlewares.checkAuth,
  enrollmentController.markResourceAsComplete
);
router.put(
  "/roadmaps/:roadmapId/enrollments/:enrollmentId/incomplete",
  middlewares.checkAuth,
  enrollmentController.markResourceAsIncomplete
);

module.exports = router;
