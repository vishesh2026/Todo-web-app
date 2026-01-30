function userReducer(user, action) {
    switch (action.type) {
        case "SET_USER": {
            return action.payload;
        }
        case "UNSET_USER": {
            return {};
        }
        default:
            return user;
    }
}

export default userReducer;