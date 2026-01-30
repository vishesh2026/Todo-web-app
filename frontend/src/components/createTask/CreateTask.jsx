import React, { useState, useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios';
import { toast } from 'react-toastify';
import './createTask.css';

function CreateTask({ selectedBoard }) {
    const { taskDispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/task', {
                ...formData,
                boardId: selectedBoard
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            taskDispatch({ type: 'ADD_TASK', payload: res.data.task });
            toast.success('Task created successfully');
            setFormData({ title: '', description: '', priority: 'medium' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create task');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-task-container">
            <form onSubmit={handleSubmit} className="create-task-form">
                <div className="form-row">
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Task title..."
                        className="task-input"
                    />
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="priority-select"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Task description..."
                    className="task-textarea"
                    rows={2}
                />
                <button type="submit" className="btn-add-task" disabled={loading}>
                    {loading ? 'Adding...' : '+ Add Task'}
                </button>
            </form>
        </div>
    );
}

export default CreateTask;