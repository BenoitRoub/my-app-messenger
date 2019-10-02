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
const styleUsers = {
	justifyContent: "flex-start",
	padding: "5px 20px",
	fontWeight: "400",
	width: "100%"
};
const inputStyle = {
	padding: "5px 20px"
};

export default function SearchUsersForm(props) {
	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState([]);

	function updateSearchInput(e) {
		setSearchInput(e.target.value);

		if (e.target.value !== "") {
			axios
				.get(
					`http://localhost:5000/${props.users}/${props.username}/${e.target.value}`
				)
				.then(res => {
					if (res.data.length > 0) {
						setUsers(res.data);
					} else setUsers([{ user: `No ${props.users} find..` }]);
				});
		} else setUsers([]);
	}

	function createDiscussion(usernameFriend) {
		const conversation = {
			username: props.username,
			to_username: usernameFriend
		};
		axios
			.post(`http://localhost:5000/conversations/add`, conversation)
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
				{users[0] !== undefined ? <Divider /> : null}
				{users.map(user => (
					<Button
						style={styleUsers}
						key={user.to_username}
						onClick={() => createDiscussion(user.to_username)}
					>
						{user.to_username}
					</Button>
				))}
			</Paper>
		</div>
	);
}
