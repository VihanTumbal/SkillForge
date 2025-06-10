import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid token. User not found.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};

export const generateToken = (userId: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as jwt.SignOptions);
};
