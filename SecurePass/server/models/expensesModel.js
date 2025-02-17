import connectDB from "../db/connection.js";
import { ObjectId } from "mongodb";

const getExpensesCollection = async () => {
  const db = await connectDB();
  return db.collection("expenses");
};

export const insertData = async (data) => {
  const dataCollection = await getExpensesCollection();
  // return dataCollection.insertOne(data);
  if (Array.isArray(data)) {
    // Handle bulk insert
    return dataCollection.insertMany(data);
  } else {
    // Handle single insert
    return dataCollection.insertOne(data);
  }
};

export const findDataByUserId = async (userId) => {
  const dataCollection = await getExpensesCollection();
  return dataCollection.find({ username: userId }).toArray();
};

export const deleteDataById = async (dataId) => {
  const dataCollection = await getExpensesCollection();
  return dataCollection.deleteOne({ _id: new ObjectId(dataId) });
};

export const deleteAllDataByUserId = async (userId) => {
  const dataCollection = await getExpensesCollection();
  return dataCollection.deleteMany({ username: userId });
};