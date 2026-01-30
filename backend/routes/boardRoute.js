import express from "express";
import { 
    createBoard, 
    getBoards, 
    getBoardById, 
    updateBoard, 
    deleteBoard 
} from "../controllers/boardController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// All board routes require authentication
router.use(requireAuth);

// Board CRUD routes
router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;