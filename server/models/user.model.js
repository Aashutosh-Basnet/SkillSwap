import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
        default: null,
    },
    about: {
        type: String,
        required: false,
        default: '',
    },
    gender: {
        type: String,
        required: false,
    },
    learning_skills: {
        type: [String],
        required: true,
    },
    teaching_skills: {
        type: [String],
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    previous_meeting: {
        type: [String],
    },
    skillswap_credits: {
        type: Number,
        required: true,
        default: 5,
        min: 0
    }
},
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;