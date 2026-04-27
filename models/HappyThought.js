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
  }
})

export const HappyThought = mongoose.model("HappyThought", happyThoughtSchema)