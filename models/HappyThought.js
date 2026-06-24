import mongoose from "mongoose"

const happyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  hearts: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

export const HappyThought = mongoose.model("HappyThought", happyThoughtSchema)