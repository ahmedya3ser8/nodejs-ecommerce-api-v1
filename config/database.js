import mongoose from "mongoose";

const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected Successfully ${conn.connection.host}`);
  })
}

export default dbConnection;
