import connectDB from "../db/connection.js";
import { ObjectId } from "mongodb";

const getDataCollection = async () => {
  const db = await connectDB();
  return db.collection("data");
};

export const insertData = async (data) => {
  const dataCollection = await getDataCollection();
  return dataCollection.insertOne(data);
};

export const findDataByUserId = async (userId) => {
  const dataCollection = await getDataCollection();
  return dataCollection.find({ username: userId }).toArray();
};

export const deleteDataById = async (dataId) => {
  const dataCollection = await getDataCollection();
  return dataCollection.deleteOne({ _id: new ObjectId(dataId) });
};

export const deleteAllDataByUserId = async (userId) => {
  const dataCollection = await getDataCollection();
  return dataCollection.deleteMany({ username: userId });
};
