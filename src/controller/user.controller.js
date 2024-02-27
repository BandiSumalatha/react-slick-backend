import User from "../models/User.model.js";
import UserCredentials from "../models/Credentials.model.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.model.js";

const UserRegister = async (req, res) => {
    try {
        const userData = req.body;
        if (userData.password !== userData.confirmPassword) {
            return res.status(400).json({ message: 'password dont match' })
        }
        const hashedPassword = await bcrypt.hash(userData.password, 0)
        console.log(hashedPassword, "hashedpassword")
        const newUser = await User.create(userData)
        console.log(newUser, "newuser")
        await UserCredentials.create({
            password: hashedPassword,
            confirmPassword: hashedPassword,
            userId: newUser.id
        })

        return res.status(201).json({ message: 'User registered successfully', user: newUser })
    } catch (err) {
        return res.status(500).json({ mesage: 'Internal server error' })
    }
}

const generateOTP = (length) => {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const userCredential = await UserCredentials.findOne({ where: { userId: user.id } });
        if (!userCredential) {
            console.log('User credentials not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, userCredential.password);
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const tokenPayload = {
            userId: user.id,
        };

        const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '1h' });
        const otp = generateOTP(6);
        await Otp.create({ otp, userId: user.id });

        const transporter = nodemailer.createTransport({
            host: 'server1.dnspark.in',
            port: 587,
            secure: false,
            auth: {
                user: 'stock_isms@kloners.in',
                pass: 'Rameshaa@16'
            }
        });

        const mailOptions = {
            from: 'stock_isms@kloners.in',
            to: user.email,
            subject: 'Your OTP for Login',
            text: `Your OTP for login is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent:', info.response);
                const responseData = {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        fname: user.fname,
                        lname: user.lname,
                        phonenumber: user.phonenumber,
                        dob: user.dob,
                        address: user.address,
                        password: user.password,
                        gender: user.gender,
                        confirmPassword: user.confirmPassword
                    }
                };
                return res.status(200).json(responseData);
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }
        const userCredentials = await UserCredentials.findOne({ where: { userId } });
        if (!userCredentials) {
            return res.status(404).json({ message: 'User credentials not found' });
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, userCredentials.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await userCredentials.update({ password: hashedNewPassword });
        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const userData = req.body;
       
        if (userData.password !== userData.confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // const saltRounds = 10; 
        // const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const updatedUser = await User.findByPk(userId); 
        console.log(updatedUser,"updatedUser")
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        updatedUser.fname = userData.fname;
        updatedUser.lname = userData.lname;
        updatedUser.phonenumber = userData.phonenumber;
        updatedUser.email = userData.email;
        updatedUser.address = userData.address;
        updatedUser.dob = userData.dob;
        updatedUser.gender = userData.gender;

        await updatedUser.save();
        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};






const otpvalidate = async (req, res) => {
    try {
        const { otp } = req.body;
        const existingOTP = await Otp.findOne({ where: { otp } });
        if (existingOTP) {

            const otpExpirationTime = new Date(existingOTP.createdAt).getTime() + 10 * 60 * 1000; // Add 2 minutes to OTP creation time
            const currentTime = Date.now();

            if (currentTime <= otpExpirationTime) {
                return res.status(200).json({ message: 'OTP validated successfully' });
            } else {
                return res.status(404).json({ error: 'OTP has expired' });
            }
        } else {
            return res.status(404).json({ error: 'Invalid OTP' });
        }

    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export { UserRegister, loginUser, otpvalidate, updatePassword ,updateUser}