import mongoose from "mongoose";

export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = "mongodb+srv://mongo:mongo@cluster0.mfbwr3w.mongodb.net/nextEcommerce?retryWrites=true&w=majority";
    return mongoose.connect(uri);
  }
}