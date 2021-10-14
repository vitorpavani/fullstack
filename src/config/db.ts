import 'dotenv/config';

import mongoose from 'mongoose';
const db =
  process.env.MONGO_URI ||
  "mongodb://root:example@localhost:27017/?authSource=admin";

export const connectDB = async ():Promise<unknown> => {
  try {
    await mongoose.connect(db);
    return console.log('MongoDB Connected...');
  } catch (err:any) {
    console.error(err.message);
    return  process.exit(1);
  }
};

export default connectDB;

