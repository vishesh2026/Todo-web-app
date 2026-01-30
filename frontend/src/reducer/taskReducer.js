function taskReducer(tasks, action) {
    switch (action.type) {
        case "SET_TASKS": {
            return action.payload;
        }
        case "ADD_TASK": {
            return [...tasks, action.payload];
        }
        case "UPDATE_TASK": {
            return tasks.map((task) => {
                if (task._id === action.payload._id) {
                    // Merge the updated task with existing task to preserve all fields
                    return {
                        ...task,
                        ...action.payload,
                        // Ensure boardId is preserved
                        boardId: action.payload.boardId || task.boardId
                    };
                }
                return task;
            });
        }
        case "REMOVE_TASK": {
            return tasks.filter((task) => task._id !== action.payload);
        }
        case "CLEAR_TASKS": {
            return [];
        }
        default: {
            throw Error("Unknown Action: " + action.type);
        }
    }
}

export default taskReducer;