import boardModel from "../models/boardModel.js";
import taskModel from "../models/taskModel.js";

// Create a new board
const createBoard = async (req, res) => {
    try {
        const { title, description, color } = req.body;
        const userId = req.user.id;
        
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Board title is required" });
        }
        
        const newBoard = new boardModel({
            title: title.trim(),
            description: description?.trim() || '',
            color: color || '#3B82F6',
            userId
        });
        
        const board = await newBoard.save();
        
        res.status(201).json({ 
            message: "Board created successfully",
            board 
        });
        
    } catch (error) {
        console.error("Create board error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all boards for a user
const getBoards = async (req, res) => {
    try {
        const userId = req.user.id;
        const { includeArchived } = req.query;
        
        const filter = { userId };
        if (includeArchived !== 'true') {
            filter.isArchived = false;
        }
        
        const boards = await boardModel
            .find(filter)
            .sort({ createdAt: -1 });
        
        // Get task counts for each board
        const boardsWithCounts = await Promise.all(
            boards.map(async (board) => {
                const totalTasks = await taskModel.countDocuments({ 
                    boardId: board._id 
                });
                const completedTasks = await taskModel.countDocuments({ 
                    boardId: board._id, 
                    completed: true 
                });
                
                return {
                    ...board.toObject(),
                    taskCount: totalTasks,
                    completedCount: completedTasks
                };
            })
        );
        
        res.status(200).json(boardsWithCounts);
        
    } catch (error) {
        console.error("Get boards error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single board by ID
const getBoardById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const board = await boardModel.findOne({ _id: id, userId });
        
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        // Get task counts
        const totalTasks = await taskModel.countDocuments({ boardId: id });
        const completedTasks = await taskModel.countDocuments({ 
            boardId: id, 
            completed: true 
        });
        
        res.status(200).json({
            ...board.toObject(),
            taskCount: totalTasks,
            completedCount: completedTasks
        });
        
    } catch (error) {
        console.error("Get board error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a board
const updateBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, color, isArchived } = req.body;
        
        const board = await boardModel.findOne({ _id: id, userId });
        
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        if (title !== undefined) board.title = title.trim();
        if (description !== undefined) board.description = description.trim();
        if (color !== undefined) board.color = color;
        if (isArchived !== undefined) board.isArchived = isArchived;
        
        const updatedBoard = await board.save();
        
        res.status(200).json({ 
            message: "Board updated successfully",
            board: updatedBoard 
        });
        
    } catch (error) {
        console.error("Update board error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a board (and optionally its tasks)
const deleteBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { deleteTasks } = req.query; // ?deleteTasks=true to delete tasks too
        
        const board = await boardModel.findOne({ _id: id, userId });
        
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        
        // Delete associated tasks if requested
        if (deleteTasks === 'true') {
            await taskModel.deleteMany({ boardId: id });
        } else {
            // Check if board has tasks
            const taskCount = await taskModel.countDocuments({ boardId: id });
            if (taskCount > 0) {
                return res.status(400).json({ 
                    message: "Cannot delete board with tasks. Either delete tasks first or use ?deleteTasks=true" 
                });
            }
        }
        
        await boardModel.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Board deleted successfully" });
        
    } catch (error) {
        console.error("Delete board error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { 
    createBoard, 
    getBoards, 
    getBoardById, 
    updateBoard, 
    deleteBoard 
};