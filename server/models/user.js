import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 64
    },
    picture: {
        type: String,
        default: "https://res.cloudinary.com/dzqbzqgjw/image/upload/v1599098981/default-user-image_qjqjqj.png"
    },
    role: {
        type: [String],
        default: ["Subscriber"],
        enum: ["Subscriber", "Instructor", "Admin"]
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    passwordResetCode: {
        type: String,
        default: ""
    },
},

    { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
