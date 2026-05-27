import { User } from "../models/User.js"

export const authenticateUser = async (request, response, next) => {
  try {
    const user = await User.findOne({ accessToken: request.header("Authorization").replace("Bearer", "")})

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