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

module.exports = router;
