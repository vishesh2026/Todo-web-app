import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
}

// Register user with email verification
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Validation
        if (validator.isEmpty(name) || validator.isEmpty(email) || validator.isEmpty(password)) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character" 
            });
        }
        
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            isVerified: false
        });
        
        const user = await newUser.save();
        
        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken, name);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Continue even if email fails - user can request resend
        }
        
        // Create token (but user still needs to verify email)
        const token = createToken(user._id);
        
        res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            },
            token
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Verify email
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    
    try {
        const user = await userModel.findOne({ verificationToken: token });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }
        
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        
        res.status(200).json({ 
            message: "Email verified successfully! You can now use all features.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
        
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Resend verification email
const resendVerification = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        
        // Send verification email
        await sendVerificationEmail(email, verificationToken, user.name);
        
        res.status(200).json({ message: "Verification email sent successfully" });
        
    } catch (error) {
        console.error("Resend verification error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Allow login but remind to verify if not verified
        const token = createToken(user._id);
        
        const responseMessage = user.isVerified 
            ? "Login successful" 
            : "Login successful! Please verify your email to access all features.";
        
        res.status(200).json({
            message: responseMessage,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            },
            token
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Get user info
const getUser = async (req, res) => {
    const id = req.user.id;
    
    try {
        const user = await userModel.findById(id).select('-password -verificationToken -resetToken');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user });
        
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: error.message });
    }
}

export { loginUser, registerUser, getUser, verifyEmail, resendVerification };