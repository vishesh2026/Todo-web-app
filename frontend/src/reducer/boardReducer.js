function boardReducer(boards, action) {
    switch (action.type) {
        case "SET_BOARDS": {
            return action.payload;
        }
        case "ADD_BOARD": {
            return [...boards, action.payload];
        }
        case "UPDATE_BOARD": {
            return boards.map((board) =>
                board._id === action.payload._id ? action.payload : board
            );
        }
        case "REMOVE_BOARD": {
            return boards.filter((board) => board._id !== action.payload);
        }
        case "CLEAR_BOARDS": {
            return [];
        }
        default: {
            throw Error("Unknown Action: " + action.type);
        }
    }
}

export default boardReducer;