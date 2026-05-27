import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/User.js"
import { seedingUsers } from "../seedingDatabase/seedingUsers.js"

const router = express.Router()

seedingUsers()

router.get("/:id", async (request, response) => {
  try {
  const { id } = request.params
  const user = await User.findById(id)

  if (user) {
    response.status(200).json({
      message: "Hej!!!! Välkommen till din sida, " + user.firstName + "!!!",
      user
    })
  } else {
    response.status(404).json({
      error: "user not found"
    })
  }

  } catch (error) {
    response.status(400).json({
      error: "invalid request"
    })
  }
})

router.post("/signup", async (reqest, response) => {
  try {
    const { firstName, lastName, email, password } = reqest.body
    const existingUser = await User.findOne({ email: email.toLowerCase()})

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "An error occurred when creating the user"
      })
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    const savedUser = await user.save()

    response.status(201).json({
      success: true,
      message: "User created successfully",
      response: {
        savedUser: savedUser
      }
    })

  } catch (error) {
    response.status(400).json({
      success: false,
      message: "failed to create user",
      response: error
    })
  }
})

router.post("/login", async (reqest, response) => {
  try {
    const { email, password } = reqest.body
    const user = await User.findOne({email: email.toLowerCase()})

    if (user && bcrypt.compareSync(password, user.password)) {
      response.status(200).json({
        success: true,
        message: "Login successful",
        response: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken
        }
      })
    } else {
      response.status(401).json({
        success: false,
        message: "Invalid email or password",
        response: null 
      })
    }
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Something went wrong during login",
      response: error
    })
  }
})

export default router