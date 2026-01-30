import React, { useState } from 'react';
import Task from './Task';

function TaskList({ tasks }) {
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true; // 'all'
    });

    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    if (tasks.length === 0) {
        return (
            <div className="empty-state-small">
                <p>No tasks yet. Create your first task!</p>
            </div>
        );
    }

    return (
        <div className="task-list-container">
            <div className="task-filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Tasks ({tasks.length})
                </button>
                <button
                    className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Active ({activeCount})
                </button>
                <button
                    className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({completedCount})
                </button>
            </div>

            <div className="task-list">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <Task key={task._id} task={task} />
                    ))
                ) : (
                    <div className="empty-filter-state">
                        <p>No {filter} tasks</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskList;