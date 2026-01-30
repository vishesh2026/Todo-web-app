import userModel from "../models/userModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// Forgot password (generate token and send email)
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const user = await userModel.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({ 
                message: "If an account with that email exists, a password reset link has been sent." 
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();
        
        // Send password reset email
        try {
            await sendPasswordResetEmail(email, resetToken, user.name);
        } catch (emailError) {
            console.error("Password reset email failed:", emailError);
            return res.status(500).json({ 
                message: "Failed to send password reset email. Please try again." 
            });
        }
        
        res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent."
        });
        
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Reset password using token
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    
    try {
        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }
        
        const user = await userModel.findOne({ 
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid or expired reset token" 
            });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        
        res.status(200).json({ 
            message: "Password reset successful. You can now login with your new password." 
        });
        
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { forgotPassword, resetPassword };