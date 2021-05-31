const express = require("express");
const router = express.Router();

const middlewares = require("../middlewares");
const profileController = require("../controllers/profileController");

router.get("/profile/experts", profileController.getExperts);
router.put(
  "/profile/:profileId/experts",
  middlewares.checkAuth,
  profileController.makeExpert
);

module.exports = router;
