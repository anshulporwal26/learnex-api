const mongoose = require("mongoose");
const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    roadmap: {
      type: Schema.Types.ObjectId,
      ref: "Roadmap",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);
