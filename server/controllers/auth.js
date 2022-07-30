import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import 'dotenv/config';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const SES = new AWS.SES(awsConfig);


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        // password length
        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" });
        }
        // email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email" });
        }
        console.log("Registering user...");
        // check if user already exists
        let user = await User.findOne({ email });
        console.log(user);
        if (user) {
            console.log("User already exists");
            return res.status(400).json({ msg: "User already exists" });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        user = new User({ name, email, password: hashedPassword });
        const newUser = await user.save();
        res.status(201).json({ msg: "User created successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        // email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email" });
        }
        console.log("Logging in user...");
        // check if user exists
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            console.log("User does not exist");
            return res.status(400).json({ msg: "User does not exist" });
        }
        // compare password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            console.log("Password is incorrect");
            return res.status(400).json({ msg: "Password is incorrect" });
        }
        console.log("User logged in");
        // create signed token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // return user and token to the client, exclude password
        user.password = undefined;
        // send token in cookie
        res.cookie('token', token, {
            expires: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 7
            ),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        res.status(200).json({ user });

    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ msg: "Logged out successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
}

export const currentUser = async (req, res) => {
    try {
        console.log("Fetching current user...", req.auth);
        const user = await User.findById(req.auth._id).select('-password').exec();
        // console.log('CURRENT_USER', user);
        res.status(200).json({ isLogin: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
}

export const sendEmail = async (req, res, resetToken) => {
    try {
        console.log("Sending email using SES...");
        // Create sendEmail params 
        var params = {
            Destination: { /* required */
                // CcAddresses: [
                //     'EMAIL_ADDRESS',
                //     /* more items */
                // ],
                ToAddresses: [
                    'jatindera@gmail.com',
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                        <h1>Reset password link</h1>
                        <p>Please use the following link to reset your password</p>
                        <a href="http://localhost:3000/resetPassword/?resetToken=${resetToken}">Reset password</a>
                        `
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Password reset link'
                }
            },
            Source: process.env.EMAIL_FROM, /* required */
            ReplyToAddresses: [
                'jatindera@gmail.com',
                /* more items */
            ],
        };
        console.log(awsConfig)

        const emailSent = SES.sendEmail(params).promise();
        emailSent.then(data => {
            console.log(data);
            res.status(200).json({ msg: "Please check your email" });
        }
        ).catch(err => {
            console.log(err);
            res.status(400).send(err);
        }
        );

    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
}

export const forgotPassword = async (req, res) => {
    try {
        console.log("Forgot password...");
        const { email } = req.body;
        // validation
        if (!email) {
            return res.status(400).json({ msg: "Please enter your email" });
        }
        // email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ msg: "Please enter a valid email" });
        }
        // check if user exists
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            console.log("User does not exist");
            return res.status(400).json({ msg: "User does not exist" });
        }
        // create reset token
        const resetToken = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // send reset token to user
        sendEmail(req, res, resetToken);
    }
    catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
}
export const validateToken = async (req, res) => {
    try {
        const { resetToken } = req.query;
        if (!resetToken) {
            return res.status(400).json({ msg: false });
        }
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        console.log("Token id is:", decoded._id);
        res.status(200).json({ msg: true });

    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Token is invalid or expired..." });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { password, resetToken } = req.body;
        // console.log("Reset Token...", resetToken);
        if (!resetToken && !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        console.log("Decoded Token is", decoded._id);
        // find user by id
        let user = await User.findById(decoded._id);
        if (!user) {
            console.log("User does not exist");
            return res.status(400).json({ msg: "User does not exist" });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        // update password
        user.password = hashedPassword;
        await user.save();
        console.log("Password updated");
        res.status(200).json({ msg: "Password updated successfully." });

    }
    catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Token is invalid or expired." });
    }
}





