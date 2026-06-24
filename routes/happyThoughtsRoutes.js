import express from "express"
import { authenticateUser } from "../middleware/authMiddleware.js"
import { HappyThought } from "../models/HappyThought.js"

const router = express.Router()

router.get("/", async (request, response) => {

  const { minLikes } = request.query

  const query = {}

  if (minLikes) {
    query.hearts = {$gte: Number(minLikes)}
  }

  try {
   
    const filteredMessages = await HappyThought.find(query)
      .sort({ createdAt: "desc" })
      .populate("author", "firstName lastName")

    if (filteredMessages.length === 0) {
      return response.status(404).json({
        success: false,
        response: [],
        message: "No thoughts were found for that query"
      })
    }

    return response.status(200).json({
      success: true,
      response: filteredMessages,
      message: "Success"
    })
  } catch (error) {
    return response.status(500).json({
      success: false,
      response: [],
      message: error
    })
  }
})

router.post("/", authenticateUser, async (request, response) => {
  const { message } = request.body

  try {
    const newHappyThought = await new HappyThought({ message, author: request.user._id }).save()
    await newHappyThought.populate("author", "firstName lastName")
    response.status(201).json({
      success: true,
      response: newHappyThought,
      message: "Happy thought created successfully"
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      response: error,
      message: "Couldn't create happy thought"
    })
  }
})


router.get("/:id", async (request, response) => {
  const { id } = request.params

  try {
    const happyThought = await HappyThought.findById(id).populate("author", "firstName lastName")
    if (!happyThought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy thought not found"
      })
    }

    response.status(200).json({
      success: true,
      response: happyThought
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      response: error,
      message: "Happy thought couldn't be found"
    })
  }

})


router.delete("/:id", authenticateUser, async (request, response) => {
  const { id } = request.params

  if (!id || !mongoose.isValidObjectId(id)) {
    return response.status(400).json({
      success: false,
      response: null,
      message: "Invalid ID"
    })
  }

  if (!request.user || !request.user._id) {
    return response.status(401).json({
      success: false,
      response: null,
      message: "User not authenticated"
    })
  }

  try {

    const thought = await HappyThought.findById(id)

    if (!thought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy thought not found"
      })
    }

    if (!thought.author || !thought.author.equals(request.user._id)) {
      return response.status(403).json({
        success: false,
        response: null,
        message: "You are not authorized to delete this thought"
      })
    }

    const deletedThought = await HappyThought.findByIdAndDelete(id)

    if (!deletedThought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy thought not found"
      })
    }

    response.status(200).json({
      success: true,
      response: deletedThought,
      message: "Happy thought deleted successfully"
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      response: error,
      message: "Error deleting happy thought"
    })
  }
})

router.patch("/:id", authenticateUser, async (request, response) => {
  const { id } = request.params
  const { message } = request.body

  try {

    if (!message || message.length <5 || message.length > 140) {
      return response.status(400).json({
        success: false,
        response: null,
        message: "Message must be between 5 and 140 characters"
      })
    }

    const thought = await HappyThought.findById(id)

    if (!thought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy Thought not found"
      })
    }

    if (!thought.author.equals(request.user._id)) {
      return response.status(403).json({
        success: false,
        response: null,
        message: "You are not authorized to update this thought"
      })
    }

    const updatedHappyThought = await HappyThought.findByIdAndUpdate(id, { message }, { new: true})

    if (!updatedHappyThought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy Thought not found"
      })
    }

    return response.status(200).json({
      success: true,
      response: updatedHappyThought,
      message: "Happy Thought updated successfully"
    })

  } catch (error) {
    response.status(500).json({
      success: false,
      response: null,
      message: "Could not update thought"
    })
  }
})

router.patch("/:id/like", async (request, response) => {
  const { id } = request.params

  try {
    const happyThought = await HappyThought.findByIdAndUpdate(id, { $inc: {hearts: 1}}, { new: true })

    if (!happyThought) {
      return response.status(404).json({
        success: false,
        response: null,
        message: "Happy thought not found"
      })
    }

    response.status(200).json({
      success: true,
      response: happyThought,
      message: "Happy thought liked successfully"
    })
  } catch (error) {
    response.status(500).json({
      success: false,
      response: error,
      message: "Error liking happy thought"
    })
  }

})


export default router