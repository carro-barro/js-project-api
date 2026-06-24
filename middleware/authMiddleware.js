import { User } from "../models/User.js"

export const authenticateUser = async (request, response, next) => {
  try {

    const authHeader = request.header("Authorization") || request.get("Authorization")

    if(!authHeader) {
      return response.status(401).json({
        message: "Authentication missing or invalid",
        loggedOut: true
      })
    }

    const user = await User.findOne({ accessToken: authHeader.replace("Bearer ", "")})

    if (user) {
      request.user = user
      next()
    } else {
      response.status(401).json({
        message: "Authentication missing or invalid",
        loggedOut: true
      })
    }

  } catch (error) {
    response.status(500).json({
      message: "internal server error",
      error: error.message
    })
  }
}