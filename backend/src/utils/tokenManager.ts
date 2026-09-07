import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SECRET = process.env.JWT_SECRET || "";

export const createToken = (id: string, email: string, expiresIn: string) => {
  const payload = { id, email };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim() === "") {
    res.status(401).json({ message: "Token Not Received" });
    return;
  }
  return new Promise<void>((resolve) => {
    jwt.verify(token, JWT_SECRET, (err: any, success: any) => {
      if (err) {
        res.status(401).json({ message: "Token Expired" });
        return resolve();
      } else {
        res.locals.jwtData = success;
        next();
        return resolve();
      }
    });
  });
};