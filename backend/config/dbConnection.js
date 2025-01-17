import mongoose from "mongoose";

export default function connect() {
    const connection_url = process.env.MONGODB_URL;
    mongoose.connect(connection_url, {})
        .then(
            () => console.log("Database connected successfully")
        )
        .catch(
            (error) => {
                console.log("Database connection failed, exiting now..", error);
                process.exit(1);
            }
        )
}