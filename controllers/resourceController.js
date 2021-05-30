const Resource = require("../models/Resource");
const errorHandler = require("../helpers/dbErrorHandler");

exports.getResources = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const resources = await Resource.find({ roadmap: roadmapId }); // FIXME: check for cursor/pagination
    return res.status(200).json(resources);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const resource = new Resource({ ...req.body.resource, roadmap: roadmapId });
    const savedResource = await resource.save();
    return res.status(201).json(savedResource);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { resourceId, roadmapId } = req.params;
    const { resource } = req.body;
    const updatedResource = await Resource.findOneAndUpdate(
      { _id: resourceId, roadmap: roadmapId },
      resource,
      { new: true }
    );
    return res.status(200).json(updatedResource);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { resourceId, roadmapId } = req.params;
    await Resource.findOneAndDelete({ _id: resourceId, roadmap: roadmapId });
    return res.status(204).json({});
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
