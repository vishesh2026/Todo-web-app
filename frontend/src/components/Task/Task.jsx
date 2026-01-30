import React, { useContext, useState } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Task.css';

function Task({ task }) {
    const { taskDispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority
    });

    const handleToggle = async () => {
        try {
            const res = await axios.patch(`/task/${task._id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            taskDispatch({ type: 'UPDATE_TASK', payload: res.data.task });
            toast.success(task.completed ? 'Task marked as active' : 'Task completed!');
        } catch (error) {
            toast.error('Failed to update task');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this task?')) {
            try {
                await axios.delete(`/task/${task._id}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                taskDispatch({ type: 'REMOVE_TASK', payload: task._id });
                toast.success('Task deleted');
            } catch (error) {
                toast.error('Failed to delete task');
                console.error(error);
            }
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editData.title.trim() || !editData.description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        try {
            const res = await axios.put(`/task/${task._id}`, editData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            
            // Update the task with the response data
            // Make sure to preserve the boardId from the original task
            const updatedTask = {
                ...res.data.task,
                boardId: task.boardId // Keep the original boardId if it's not in response
            };
            
            taskDispatch({ type: 'UPDATE_TASK', payload: updatedTask });
            toast.success('Task updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update task');
            console.error('Update error:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditData({
            title: task.title,
            description: task.description,
            priority: task.priority
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="task-card editing">
                <form onSubmit={handleEditSubmit} className="task-edit-form">
                    <div className="edit-form-group">
                        <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handleEditChange}
                            placeholder="Task title"
                            className="edit-input"
                            required
                        />
                    </div>
                    <div className="edit-form-group">
                        <textarea
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            placeholder="Task description"
                            className="edit-textarea"
                            rows={3}
                            required
                        />
                    </div>
                    <div className="edit-form-group">
                        <select
                            name="priority"
                            value={editData.priority}
                            onChange={handleEditChange}
                            className="edit-select"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>
                    <div className="edit-actions">
                        <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-checkbox">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                />
            </div>
            <div className="task-content">
                <h4 className="task-title">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                    <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                    </span>
                    <span className="task-time">
                        {moment(task.createdAt).fromNow()}
                    </span>
                    {task.completed && (
                        <span className="completed-badge">
                            ✓ Completed
                        </span>
                    )}
                </div>
            </div>
            <div className="task-actions">
                <EditIcon
                    className="icon-btn edit"
                    onClick={() => setIsEditing(true)}
                    titleAccess="Edit task"
                />
                <DeleteIcon
                    className="icon-btn delete"
                    onClick={handleDelete}
                    titleAccess="Delete task"
                />
            </div>
        </div>
    );
}

export default Task;