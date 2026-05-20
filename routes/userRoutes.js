import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/User.js"
import { seedingUsers } from "../seedingDatabase/seedingUsers.js"

const router = express.Router()

seedingUsers()

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email: email.toLowerCase()})

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An error occurred when creating the user"
      })
    }

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = new User({
      email,
      password
    })

    const savedUser = await user.save()

    res.status(201).json({
      success: true,
      message: "User created successfully",
      response: {
        savedUser: savedUser
      }
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "failed to create user",
      response: error
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({email: email.toLowerCase()})

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        respone: {
          email: user.email,
          id: user._id,
          accessToken: user.accessToken
        }
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        response: null
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something wnet wrong during login",
      response: error
    })
  }
})

export default router