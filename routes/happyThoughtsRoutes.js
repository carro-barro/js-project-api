import express from "express"
import { authenticateUser } from "../middleware/authMiddleware.js"
import { HappyThought } from "../models/HappyThought.js"
import { seedingThoughts } from "../seedingDatabase/seedingThoughts.js"

const router = express.Router()

seedingThoughts()

router.get("/", async (req, res) => {

  const { minLikes } = req.query
  console.log("min likes", minLikes)

  const query = {}

  if (minLikes) {
    query.hearts = {$gte: Number(minLikes)}
  }

  try {
    const filteredMessages = await HappyThought.find(query)

    if (filteredMessages.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No thoughts were found for that query"
      })
    }

    return res.status(200).json({
      success: true,
      response: filteredMessages,
      message: "Success"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: [],
      message: error
    })
  }
})

router.post("/", authenticateUser, async (req, res) => {
  const { message } = req.body

  try {
    const newHappyThought = await new HappyThought({ message }).save()

    res.status(201).json({
      success: true,
      response: newHappyThought,
      message: "Happy thought created successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Couldn't create happy thought"
    })
  }
})


router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const happyThought = await HappyThought.findById(id)

    if (!happyThought) {
      return res.status(404).json({ 
        success: false,
        response: null,
        message: "Happy thought not found"
       })
    }

    res.status(200).json({
      success: true,
      respone: happyThought
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Happy thought couldn't be found"
    })
  }

})

router.delete("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params

  try {
    
    const deletedThought = await HappyThought.findByIdAndDelete(id)

    if (!deletedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Happy thought not found"
      })
    }

    res.status(200).json({
      success: true,
      response: deletedThought,
      message: "Happy thought deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Error deleting happy thought"
    })
  }
})

export default router