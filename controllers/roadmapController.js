const Roadmap = require("../models/Roadmap");
const errorHandler = require("../helpers/dbErrorHandler");

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({})
      .populate("category")
      .populate("expert", "name profileImageUrl isVerified");
    return res.status(200).json(roadmaps);
  } catch (err) {
    console.log("err", err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.createRoadmap = async (req, res) => {
  try {
    const roadmap = new Roadmap({
      ...req.body.roadmap,
    });
    const savedRoadmap = await roadmap.save();
    return res.status(201).json(savedRoadmap);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.updateRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { roadmap } = req.body;
    const updatedRoadmap = await Roadmap.findOneAndUpdate(
      { _id: roadmapId },
      roadmap,
      { new: true }
    );
    return res.status(200).json(updatedRoadmap);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    await Roadmap.findByIdAndDelete(roadmapId);
    return res.status(204).json({});
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
