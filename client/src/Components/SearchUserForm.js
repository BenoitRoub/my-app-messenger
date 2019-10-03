import React, { useState, useEffect } from "react";
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

export default function SearchUserForm(props) {
	const [width, setWidth] = useState("60%");
	useEffect(() => {
		if (props.mobile) {
			setWidth("80%");
		}
	}, []);
	const containerSearchBar = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		width: width
	};

	const [searchInput, setSearchInput] = useState("");
	const [users, setUsers] = useState([]);

	function updateSearchInput(e) {
		setSearchInput(e.target.value);

		if (props.users === "users") {
			var query = `${props.users}/${e.target.value}`;
			fetchData(query);
		} else {
			var query = `${props.users}/${props.username}/${e.target.value}`;
			fetchData(query);
		}

		function fetchData(query) {
			if (e.target.value !== "") {
				axios.get(`http://localhost:5000/${query}`).then(res => {
					if (res.data.length > 0) {
						setUsers(res.data);
					} else
						setUsers([
							{ [props.userQuery]: `No ${props.users} found..` }
						]);
				});
			} else setUsers([]);
		}
	}

	function createAction(usernameFriend) {
		const action = {
			username: props.username,
			to_username: usernameFriend
		};
		axios
			.post(`http://localhost:5000/${props.destination}/add`, action)
			.then(res => {
				props.handleUpdateDb();
				props.handleAction();
				props.handleClick(props.destination);
			});

		setSearchInput("");
	}

	return (
		<div style={allContainer}>
			<Paper style={containerSearchBar}>
				<InputBase
					style={inputStyle}
					placeholder={`Search a ${props.users}..`}
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
						onClick={() => createAction(user[props.userQuery])}
					>
						{user[props.userQuery]}
					</Button>
				))}
			</Paper>
		</div>
	);
}
