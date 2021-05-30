const Category = require("../models/Category");
const errorHandler = require("../helpers/dbErrorHandler");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}); // FIXME: check for cursor/pagination
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category({ ...req.body.category });
    const savedCategory = await category.save();
    return res.status(201).json(savedCategory);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category } = req.body;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      category,
      { new: true }
    );
    return res.status(200).json(updatedCategory);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    return res.status(204).json({});
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
