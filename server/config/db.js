import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(
            `Connected to mongoDB ${conn.connection.host}`
        );
    } catch (error) {
        console.log(`Failed to connect mongoDB ${error}`);
    }
};

export default connectDB;