const User = require("../models/User");

exports.getExperts = async (req, res) => {
  try {
    const experts = await User.find({ role: "expert" }).select(
      "name description isVerified tags icon"
    );
    return res.status(200).json(experts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

exports.makeExpert = async (req, res) => {
  try {
    const { profileId } = req.params;
    const updatedProfile = await User.findByIdAndUpdate(
      profileId,
      { role: "expert" },
      { new: true }
    );
    return res.status(200).json(updatedProfile);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
