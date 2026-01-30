import React, { useState, useContext } from 'react';
import BoardContext from '../../context/BoardContext';
import TokenContext from '../../context/TokenContext';
import axios from '../../Axios/axios';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Board.css';

function BoardItem({ board, isSelected, onClick }) {
    const { boardDispatch } = useContext(BoardContext);
    const { userToken } = useContext(TokenContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm(`Delete board "${board.title}"? This will also delete all tasks in this board.`)) {
            try {
                await axios.delete(`/board/${board._id}?deleteTasks=true`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                boardDispatch({ type: 'REMOVE_BOARD', payload: board._id });
                toast.success('Board deleted successfully');
            } catch (error) {
                toast.error('Failed to delete board');
                console.error(error);
            }
        }
    };

    return (
        <div
            className={`board-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            style={{ borderLeft: `4px solid ${board.color}` }}
        >
            <div className="board-item-content">
                <div className="board-item-header">
                    <h3>{board.title}</h3>
                    <div className="board-item-actions">
                        <EditIcon
                            className="icon-btn"
                            fontSize="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                        />
                        <DeleteIcon
                            className="icon-btn delete"
                            fontSize="small"
                            onClick={handleDelete}
                        />
                    </div>
                </div>
                <p className="board-item-stats">
                    {board.taskCount || 0} tasks · {board.completedCount || 0} completed
                </p>
            </div>
        </div>
    );
}

export default BoardItem;