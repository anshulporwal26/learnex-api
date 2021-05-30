const express = require("express");
const router = express.Router();

const roadmapController = require("../controllers/roadmapController");
const middlewares = require("../middlewares");

router.get("/roadmaps", roadmapController.getRoadmaps);
router.post(
  "/roadmaps",
  middlewares.checkAuth,
  roadmapController.createRoadmap
);
router.put(
  "/roadmaps/:roadmapId",
  middlewares.checkAuth,
  roadmapController.updateRoadmap
);
router.delete(
  "/roadmaps/:roadmapId",
  middlewares.checkAuth,
  roadmapController.deleteRoadmap
);

module.exports = router;
