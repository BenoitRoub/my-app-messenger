const initialState = {
	username: ""
};

function UserReducer(state = initialState, action) {
	switch (action.type) {
		case "logged":
			return { username: action.username };
		case "disconnect":
			return { username: "" };
		default:
			return state;
	}
}

export default UserReducer;
