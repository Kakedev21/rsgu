import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    department: {
        type: String,
        required: true
    }

}, {timestamps: true});

const User = models.users || mongoose.model("users", UserSchema);

export default User;