import { Request, Response } from "express";
import RoomModel from "../model/room.model";
import MessageModel from "../model/message.model";
import { randomUUID } from "crypto";

export const getRoom = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const rooms = await RoomModel.find({
      userIds: { $in: [userId] },
    });

    if (!rooms) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error getting room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    if (!roomId)
      return res.status(400).json({ message: "Room ID is required" });

    const messages = await MessageModel.find({ roomId }).populate("userId");

    if (!messages) {
      return res.status(404).json({ message: "Messages not found" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { userIds, name } = req.body;
    if (!userIds)
      return res.status(400).json({ message: "User IDs are required" });

    const room = new RoomModel({
      userId: userIds,
      user: userIds,
      capacity: userIds.length,
      roomId: randomUUID().split("-").join(""),
      name,
    });

    await room.save();

    return res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};