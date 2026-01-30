import express from "express";
import { 
    addTask, 
    getTasks, 
    getTaskById, 
    updateTask, 
    removeTask,
    toggleTaskCompletion 
} from "../controllers/taskController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// All task routes require authentication
router.use(requireAuth);

// Task CRUD routes
router.post("/", addTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", removeTask);
router.patch("/:id/toggle", toggleTaskCompletion);

export default router;