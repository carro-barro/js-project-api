import { User } from "../models/User.js"
import bcrypt from "bcrypt"

export const seedingUsers = async () => {
  const salt = 10

  if (process.env.RESET_DB === "true") {
    console.log("Resetting seeding database...");
    await User.deleteMany()
  }

    await new User ({
      firstName: "Carolina",
      lastName: "Oldertz",
      email: "carolina.oldertz@gmail.com",
      password: bcrypt.hashSync("carolina", salt)
    }).save();

    await new User ({
      firstName: "Mikaela",
      lastName: "Sturk",
      email: "mikaelasturk@gmail.com",
      password: bcrypt.hashSync("mikaela", salt)
    }).save()
}