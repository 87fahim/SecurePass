import connectDB from "../db/connection.js";
import { ObjectId } from "mongodb";

const getUsersCollection = async () => {
  const db = await connectDB();
  return db.collection("users");
};

export const findUserById = async (userId) => {
  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ _id: new ObjectId(userId) });
};

export const findUserByUsername = async (username) => {
  const usersCollection = await getUsersCollection();
  return usersCollection.findOne({ username });
};

export const insertUser = async (userData) => {
  const usersCollection = await getUsersCollection();
  return usersCollection.insertOne(userData);
};
