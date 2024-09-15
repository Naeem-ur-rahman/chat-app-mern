import mongoose from "mongoose";
import { createHmac, randomBytes } from 'crypto';
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is Required."]
    },
    salt: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
    },
    color: {
        type: Number,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return { error: 'User not Found.' };

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHash) return { error: 'Incorrect Password' };

    const maxAge = 3 * 24 * 60 * 60 * 1000;
    const createToken = async (email, userId) => {
        return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
    };

    const token = await createToken(user.email, user._id)
    return token;
});

const User = mongoose.model("Users", userSchema);

export default User;