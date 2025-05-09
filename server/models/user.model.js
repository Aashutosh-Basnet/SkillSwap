import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    skills: {
        type: [string],
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    previous_meeting: {
        type: [string],
        required: true,
    }
},
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;