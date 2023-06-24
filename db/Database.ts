import mongoose from 'mongoose';

const {
  MONGO_URI: mongoUri,
  DB_NAME: dbName,
  DB_USERNAME: dbUsername,
  DB_PASSWORD: dbPassword
} = process.env;

class Database {
  public static init = async () => {
    await mongoose.connect(mongoUri as string, {
      dbName,
      auth: {
        username: dbUsername,
        password: dbPassword
      }
    });
  };
}

export default Database;
