import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

class AuthController {
  //Register
  register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        friends,
        location,
        occupation,
      } = req.body;
      const picturePath = req.file.filename;

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: 0,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Login
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ message: "User doesn`t exist" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid login data" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user._doc.password;
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export const authController = new AuthController();
