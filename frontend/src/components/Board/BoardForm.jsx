import React, { useState, useContext } from 'react';
import BoardContext from '../../context/BoardContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios';
import { toast } from 'react-toastify';
import './Board.css';

const BOARD_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

function BoardForm({ onClose, onBoardCreated, board = null }) {
    const { boardDispatch } = useContext(BoardContext);
    const { userToken } = useContext(TokenContext);
    const [formData, setFormData] = useState({
        title: board?.title || '',
        description: board?.description || '',
        color: board?.color || BOARD_COLORS[0]
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Board title is required');
            return;
        }

        setLoading(true);
        try {
            if (board) {
                // Update existing board
                const res = await axios.put(`/board/${board._id}`, formData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                boardDispatch({ type: 'UPDATE_BOARD', payload: res.data.board });
                toast.success('Board updated successfully');
            } else {
                // Create new board
                const res = await axios.post('/board', formData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                boardDispatch({ type: 'ADD_BOARD', payload: res.data.board });
                toast.success('Board created successfully');
                if (onBoardCreated) onBoardCreated(res.data.board);
            }
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{board ? 'Edit Board' : 'Create New Board'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Board Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter board title"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter board description (optional)"
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label>Board Color</label>
                        <div className="color-picker">
                            {BOARD_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormData({ ...formData, color })}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (board ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoardForm;