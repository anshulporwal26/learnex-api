const express = require("express");

const mediaHelper = require("../helpers/mediaHelper");
const Middleware = require("../middlewares");

const router = express.Router();

router.post(
  "/media/request_presigned_url",
  Middleware.checkAuth,
  mediaHelper.requestPreSignedUrl
);

module.exports = router;
