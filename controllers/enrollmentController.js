const Enrollment = require("../models/Enrollment");

exports.enroll = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { userId } = req.user;
    const enrollment = new Enrollment({ user: userId, roadmap: roadmapId });
    const savedEnrollment = await enrollment.save();
    return res.status(201).json(savedEnrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.leaveRoadmap = async (req, res) => {
  try {
    const { roadmapId, enrollmentId } = req.params;
    const { userId } = req.user;
    await Enrollment.findOneAndDelete({
      _id: enrollmentId,
      user: userId,
      roadmap: roadmapId,
    });
    return res.status(204).json({});
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.markResourceAsComplete = async (req, res) => {
  try {
    const { roadmapId, enrollmentId } = req.params;
    const { resourceId } = req.body;
    const { userId } = req.user;
    console.log("BODY", req.body);
    console.log("PARAMS", req.params);
    // FIXME: check if already present
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      {
        _id: enrollmentId,
        user: userId,
        roadmap: roadmapId,
      },
      { $addToSet: { completedResources: resourceId } },
      { new: true }
    );
    return res.status(200).json(updatedEnrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.markResourceAsIncomplete = async (req, res) => {
  try {
    const { roadmapId, enrollmentId } = req.params;
    const { resourceId } = req.body;
    const { userId } = req.user;
    // FIXME: check if present then only pull
    const updatedEnrollment = await Enrollment.findOneAndUpdate(
      {
        _id: enrollmentId,
        user: userId,
        roadmap: roadmapId,
      },
      { $pull: { completedResources: resourceId } },
      { new: true }
    );
    return res.status(200).json(updatedEnrollment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
