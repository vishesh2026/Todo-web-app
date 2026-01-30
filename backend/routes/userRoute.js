import express from 'express';
import { 
    loginUser, 
    registerUser, 
    getUser, 
    verifyEmail, 
    resendVerification 
} from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Protected routes
router.get("/getuser", requireAuth, getUser);

export default router;