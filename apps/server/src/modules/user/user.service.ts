import mongoose from "mongoose";
import User from "./user.model.js";

export async function getMe(userId: string) {
  const user = await User.findById(new mongoose.Types.ObjectId(userId));
  if (!user) throw new Error("User not found");
  return user.toPublicProfile();
}

export async function updateMe(
  userId: string,
  data: { displayName?: string; about?: string },
) {
  const allowed: Record<string, unknown> = {};
  if (data.displayName !== undefined)
    allowed.displayName = data.displayName.trim();
  if (data.about !== undefined) allowed.about = data.about.trim();

  const user = await User.findByIdAndUpdate(
    new mongoose.Types.ObjectId(userId),
    allowed,
    { new: true, runValidators: true },
  );
  if (!user) throw new Error("User not found");
  return user.toPublicProfile();
}

export async function searchUsers(query: string, userId: string) {
  if (!query.trim()) return [];
  const uid = new mongoose.Types.ObjectId(userId);
  return User.searchUsers(query, uid);
}

export async function getUserById(targetId: string) {
  const user = await User.findById(targetId);
  if (!user || user.isDeactivated) throw new Error("User not found");
  return user.toPublicProfile();
}
