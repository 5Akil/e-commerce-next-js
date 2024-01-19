import User from "@/models/User";
import { mongooseConnect } from "@/lib/mongoose";
import bcryptjs from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    if (
      !name ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 5
    ) {
      res.status(422).json({
        message: "Validation error",
      });
      return;
    }
    await mongooseConnect();
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(422).json({
        message: "User exists already",
      });
      return;
    }
    const newUser = await User({
      name,
      email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
    });
    const user = await newUser.save();
    res.status(201).send({
      message: "Created user",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    console.log(error);
  }

};

export default handler;
