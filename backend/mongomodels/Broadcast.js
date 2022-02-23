const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BroadcastSchema = new Schema(
  {
    title: { type: String, index: true },
    audience: { type: String, index: true },
    message: { type: String },
  },
  { strict: false }
);
const Broadcast = mongoose.model("Broadcast", BroadcastSchema);

module.exports = Broadcast;
