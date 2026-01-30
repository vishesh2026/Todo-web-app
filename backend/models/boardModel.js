import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Board title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    },
    color: {
        type: String,
        default: '#3B82F6', // blue-500
        match: [/^#([A-Fa-f0-9]{6})$/, 'Please provide a valid hex color']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Index for faster queries
boardSchema.index({ userId: 1, isArchived: 1 });

const boardModel = mongoose.model("Board", boardSchema);
export default boardModel;