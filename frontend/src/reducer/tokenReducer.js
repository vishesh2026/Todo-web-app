function tokenReducer(userToken, action) {
    switch (action.type) {
        case "SET_TOKEN": {
            return action.payload;
        }
        case "UNSET_TOKEN": {
            return null;
        }
        default:
            return userToken;
    }
}

export default tokenReducer;