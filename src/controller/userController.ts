import express, { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model";
import { Session } from "../model/token.model";
import FollowerModel from "../model/follower.model";

export const allUsers = (req: Request, res: Response): void => {
  try {
    const users = User.find({});
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ error: "Something Wend wrong !" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, full_name } = req.body;

    // Check if user with provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || "demo",
      {
        expiresIn: "7d",
      }
    );

    // Create session
    const newSession = await Session.create({
      userId: newUser.id,
      accessToken: token,
    });

    if (newSession) {
      res.status(201).json({ accessToken: token, message: "User created" });
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({ error: "User not found" });
      return;
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(200).json({ error: "Invalid password", code: 401 });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "demo",
      {
        expiresIn: "7d",
      }
    );

    // Create session
    const newSession = await Session.create({
      userId: user.id,
      accessToken: token,
    });

    if (newSession) {
      res.status(200).json({ user, accessToken: token });
    } else {
      throw new Error("Failed to create session");
    }
  } catch (error: any) {
    res.status(500).json({ error: "somthings went wrong " });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    // Find session by userId
    const session = await Session.findOne({ userId });
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Delete session
    await Session.deleteOne({ userId });

    res.status(200).json({ message: "User logged out" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const followUser = async (req: any, res: Response): Promise<void> => {
  try {
    const { videoId } = req.body;
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (!videoId) {
      res.status(400).json({ error: "Video not found" });
      return;
    }

    const FollowerVideo: any = await FollowerModel.find({
      videoId: videoId,
    });

    if (FollowerVideo.length === 0) {
      const newFollower = await FollowerModel.create({
        videoId: videoId,
        user_id: [userId],
        user: [userId],
      });
      await newFollower.save();
      res.status(200).json({ message: "Followed", newFollower });
      return;
    }

    if (FollowerVideo[0].user_id.includes(userId)) {
      // Already then remove id frin userid
      FollowerVideo[0].user_id = FollowerVideo[0].user_id.filter(
        (id: string) => id !== userId
      );
      await FollowerVideo[0].save();
      res.status(200).json({ error: "Already followed", FollowerVideo });
      return;
    }

    FollowerVideo[0].user_id.push(userId);
    await FollowerVideo[0].save();

    res.status(200).json({ message: "Followed", FollowerVideo });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getFollowers = async (req: any, res: Response): Promise<void> => {
  try {
    const { video_id } = req.params;
    const followers = await FollowerModel.find({
      videoId: video_id,
    });
    res.status(200).json({ followers });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
