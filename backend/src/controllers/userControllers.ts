import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/tokenManager.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";

const getCookieOptions = (expires?: Date) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    path: "/",
    httpOnly: true,
    signed: true,
    secure: isProduction,
    sameSite: "lax" as const,
    ...(expires && { expires }),
  };
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    res.status(200).json({ message: "OK", users });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user signup
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already registered");
      return;
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, getCookieOptions());

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, getCookieOptions(expires));

    res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send("User not registered");
      return;
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(403).send("Incorrect Password");
      return;
    }

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, getCookieOptions());

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, getCookieOptions(expires));

    res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }
    res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      res.status(401).send("User not registered OR Token malfunctioned");
      return;
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      res.status(401).send("Permissions didn't match");
      return;
    }

    res.clearCookie(COOKIE_NAME, getCookieOptions());

    res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "ERROR", cause: error?.message });
    return;
  }
};