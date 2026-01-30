import taskModel from "../models/taskModel.js";
import boardModel from "../models/boardModel.js";

// Add a new task
const addTask = async (req, res) => {
    try {
        const { title, description, boardId, priority, dueDate } = req.body;
        const userId = req.user.id;
        
        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Task title is required" });
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({ message: "Task description is required" });
        }
        
        if (!boardId) {
            return res.status(400).json({ message: "Board ID is required" });
        }
        
        // Verify board exists and belongs to user
        const board = await boardModel.findOne({ _id: boardId, userId });
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        const newTask = new taskModel({
            title: title.trim(),
            description: description.trim(),
            boardId,
            userId,
            priority: priority || 'medium',
            dueDate: dueDate || null,
            completed: false
        });
        
        const task = await newTask.save();
        
        res.status(201).json({ 
            message: "Task added successfully",
            task 
        });
        
    } catch (error) {
        console.error("Add task error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all tasks for a user (optionally filtered by board)
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { boardId, completed } = req.query;
        
        const filter = { userId };
        
        if (boardId) {
            filter.boardId = boardId;
        }
        
        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }
        
        const tasks = await taskModel
            .find(filter)
            .sort({ createdAt: -1 });
        
        res.status(200).json(tasks);
        
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const task = await taskModel.findOne({ _id: id, userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.status(200).json(task);
        
    } catch (error) {
        console.error("Get task error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, completed, priority, dueDate, boardId } = req.body;
        
        const task = await taskModel.findOne({ _id: id, userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        // If moving to different board, verify it exists
        if (boardId && boardId !== task.boardId.toString()) {
            const board = await boardModel.findOne({ _id: boardId, userId });
            if (!board) {
                return res.status(404).json({ message: "Target board not found" });
            }
            task.boardId = boardId;
        }
        
        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (completed !== undefined) task.completed = completed;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;
        
        const updatedTask = await task.save();
        
        // Return the task as a plain object (not populated)
        res.status(200).json({ 
            message: "Task updated successfully",
            task: updatedTask.toObject()
        });
        
    } catch (error) {
        console.error("Update task error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a task
const removeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const task = await taskModel.findOne({ _id: id, userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        await taskModel.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Task deleted successfully" });
        
    } catch (error) {
        console.error("Delete task error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Toggle task completion
const toggleTaskCompletion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const task = await taskModel.findOne({ _id: id, userId });
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        task.completed = !task.completed;
        const updatedTask = await task.save();
        
        // Return the task as a plain object (not populated)
        res.status(200).json({ 
            message: "Task status updated",
            task: updatedTask.toObject()
        });
        
    } catch (error) {
        console.error("Toggle task error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { 
    addTask, 
    getTasks, 
    getTaskById, 
    updateTask, 
    removeTask,
    toggleTaskCompletion 
};