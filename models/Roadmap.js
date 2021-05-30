const mongoose = require("mongoose");
const { Schema } = mongoose;

const roadmapSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    expert: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    enrollments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
