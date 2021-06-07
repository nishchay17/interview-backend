const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const QuestionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    descrption: {
      type: String,
      require: true,
    },
    file: {
      type: String,
      require: true,
    },
    links: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: ObjectId,
        ref: "Tag",
      },
    ],
    type: {
      type: String,
      require: true,
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswerIndex: {
      type: Number,
    },
    correctAnswer: {
      type: String,
    },
    createdByRef: {
      type: ObjectId,
      ref: "User",
    },
    createdByInfo: {
      name: {
        type: String,
        require: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
