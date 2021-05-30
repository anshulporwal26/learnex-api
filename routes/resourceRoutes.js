const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");
const middlewares = require("../middlewares");

router.get(
  "/roadmaps/:roadmapId/resources",
  middlewares.checkAuth,
  resourceController.getResources
);
router.post(
  "/roadmaps/:roadmapId/resources",
  middlewares.checkAuth,
  resourceController.createResource
);
router.put(
  "/roadmaps/:roadmapId/resources/:resourceId",
  middlewares.checkAuth,
  resourceController.updateResource
);
router.delete(
  "/roadmaps/:roadmapId/resources/:resourceId",
  middlewares.checkAuth,
  resourceController.deleteResource
);

module.exports = router;
