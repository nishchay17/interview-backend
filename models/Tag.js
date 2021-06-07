const mongoose = require("mongoose");

const TagSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    descrption: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tag", TagSchema);
