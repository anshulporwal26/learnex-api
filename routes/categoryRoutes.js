const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const middlewares = require("../middlewares");

router.get("/categories", categoryController.getCategories);
router.post(
  "/categories",
  middlewares.checkAuth,
  categoryController.createCategory
);
router.put(
  "/categories/:categoryId",
  middlewares.checkAuth,
  categoryController.updateCategory
);
router.delete(
  "/categories/:categoryId",
  middlewares.checkAuth,
  categoryController.deleteCategory
);

module.exports = router;
