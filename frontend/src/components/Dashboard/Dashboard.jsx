import React, { useState, useContext } from 'react';
import BoardContext from '../../context/BoardContext';
import TaskContext from '../../context/TaskContext';
import BoardList from '../Board/BoardList';
import BoardForm from '../Board/BoardForm';
import TaskList from '../Task/TaskList';
import CreateTask from '../createTask/CreateTask';
import './Dashboard.css';

function Dashboard() {
    const { boards } = useContext(BoardContext);
    const { tasks } = useContext(TaskContext);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [showBoardForm, setShowBoardForm] = useState(false);

    const handleBoardSelect = (boardId) => {
        setSelectedBoard(boardId);
    };

    const selectedBoardData = boards.find(b => b._id === selectedBoard);
    const boardTasks = tasks.filter(t => t.boardId === selectedBoard);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Left Sidebar - Boards */}
                <div className="boards-sidebar">
                    <div className="sidebar-header">
                        <h2>My Boards</h2>
                        <button
                            onClick={() => setShowBoardForm(true)}
                            className="btn-add-board"
                        >
                            + New Board
                        </button>
                    </div>
                    <BoardList
                        onBoardSelect={handleBoardSelect}
                        selectedBoard={selectedBoard}
                    />
                </div>

                {/* Main Content - Tasks */}
                <div className="tasks-main">
                    {selectedBoard ? (
                        <>
                            <div className="board-header">
                                <div>
                                    <h1>{selectedBoardData?.title}</h1>
                                    {selectedBoardData?.description && (
                                        <p className="board-description">{selectedBoardData.description}</p>
                                    )}
                                </div>
                                <div className="board-stats">
                                    <span className="stat">
                                        Total: {selectedBoardData?.taskCount || 0}
                                    </span>
                                    <span className="stat">
                                        Completed: {selectedBoardData?.completedCount || 0}
                                    </span>
                                </div>
                            </div>

                            <CreateTask selectedBoard={selectedBoard} />
                            <TaskList tasks={boardTasks} />
                        </>
                    ) : (
                        <div className="empty-state">
                            <h2>Welcome to Your Todo App!</h2>
                            <p>Select a board from the left to get started, or create a new one.</p>
                            {boards.length === 0 && (
                                <button
                                    onClick={() => setShowBoardForm(true)}
                                    className="btn-primary-large"
                                >
                                    Create Your First Board
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Board Form Modal */}
            {showBoardForm && (
                <BoardForm
                    onClose={() => setShowBoardForm(false)}
                    onBoardCreated={(board) => {
                        setSelectedBoard(board._id);
                        setShowBoardForm(false);
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;