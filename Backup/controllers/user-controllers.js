import { compareSync, hashSync } from "bcryptjs";
import User from "../models/User";

export const getallusers = async (req, res) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
  }
  if (!users) {
    return res.status(500).json({ message: "unexpected error occur" });
  }

  return res.status(200).json({ users });
};

export const getUserById = async (req, res) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findById(id).populate("posts");
  } catch (error) {
    return console.log(error);
  }

  if (!user) {
    res.status(404).json({ message: "user not found" });
  }

  return res.status(200).json({user})
};
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.length < 6
  ) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  const hashedpassword = hashSync(password);

  let user;
  try {
    user = new User({ email, name, password: hashedpassword });

    await user.save();
  } catch (error) {
    return console.log(error);
  }
  if (!user) {
    return res.status(500).json({ message: "unexpected eror" });
  }

  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.length < 6) {
    return res.status(422).json({ message: "Invalid Data" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "no user found" });
  }
  const isPaswordCorrect = compareSync(password, existingUser.password);

  if (!isPaswordCorrect) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  return res
    .status(200)
    .json({ id: existingUser.id, message: "Login Succesfull" });
};
