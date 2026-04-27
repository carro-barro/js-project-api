import express from "express"
import { authenticateUser } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/happy-thoughts", async (req, res) => {

  const { minLikes } = req.query
  console.log("min likes", minLikes)

  const query = {}

  if (minLikes) {
    query.hearts = {$gte: Number(minLikes)}
  }

  try {
    const filteredMessages = await Thought.find(query)

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

router.post("/happy-thoughts", authenticateUser, (req, res) => {
  const body = req.body

  const newThought = {
    _id: data.length + 1,
    message: body.message,
    hearts: body.hearts,
    createdAt: body.createdAt,
    __v: body.__v
  }

  data.push(newThought)

  res.json(newThought)
})


router.get("/happy-thoughts/:id", (req, res) => {
  const id = req.params.id

  const happyThought = data.find((happyThought) => happyThought._id === id)

  if (!happyThought) {
    return res.status(404).json({ error: `happy thought with id ${id} does not exist` })
  }

  res.json(happyThought)

})

router.delete("/happy-thoughts/:id", authenticateUser, (req, res) => {
  const { id } = req.params
  const thought = data.find((thought) => String(thought._id) === String(id))

  if (!thought) {
    return res.status(404).json({error: `thought with id ${id} does not exist`})
  }

  const newThoughts = data.filter((thought) => String(thought._id) !== String(id))

  data = newThoughts

  res.json(thought)
})

export default router