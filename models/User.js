const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    questionCreated: [
      {
        type: ObjectId,
        ref: "Question",
      },
    ],
    questionBookmarked: [
      {
        type: ObjectId,
        ref: "Question",
      },
    ],
    attemptedQuestions: [
      {
        question: {
          type: ObjectId,
          ref: "Question",
        },
        isAnswerCorrect: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
