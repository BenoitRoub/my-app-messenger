import React, { useState } from "react";
import axios from "axios";

import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

const allContainer = {
	display: "flex",
	justifyContent: "center"
};
const containerSearchBar = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	width: "50%"
};
const styleFriends = {
	justifyContent: "flex-start",
	padding: "5px 20px",
	fontWeight: "400",
	width: "100%"
};
const inputStyle = {
	padding: "5px 20px"
};

export default function CreateConversation(props) {
	const [searchInput, setSearchInput] = useState("");
	const [friends, setFriends] = useState([]);

	function updateSearchInput(e) {
		setSearchInput(e.target.value);

		if (e.target.value !== "") {
			axios
				.get(`/database/friends/${props.username}/${e.target.value}`)
				.then(res => {
					if (res.data.length > 0) {
						setFriends(res.data);
					} else setFriends([{ friend: "No friends find.." }]);
				});
		} else setFriends([]);
	}

	function createDiscussion(usernameFriend) {
		const conversation = {
			username: props.username,
			to_username: usernameFriend
		};
		axios
			.post(`/database/conversations/add`, conversation)
			.then(res => props.handleUpdateDb());
	}

	return (
		<div style={allContainer}>
			<Paper style={containerSearchBar}>
				<InputBase
					style={inputStyle}
					placeholder="Search a friend..."
					inputProps={{
						"aria-label": "description"
					}}
					autoFocus
					value={searchInput}
					onChange={updateSearchInput}
				/>
				{friends[0] !== undefined ? <Divider /> : null}
				{friends.map(friend => (
					<Button
						style={styleFriends}
						key={friend.friend}
						onClick={() => createDiscussion(friend.friend)}
					>
						{friend.friend}
					</Button>
				))}
			</Paper>
		</div>
	);
}
