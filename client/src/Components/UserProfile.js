import React, { useEffect, useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import SnackBar from "./MaterialUIComponent/SnackBar";

const allContainer = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "20px 80px",
	marginTop: 20,
	marginBottom: 40
};
const inputStyle = {
	padding: "5px 20px"
};

export default function UserProfile(props) {
	const [friends, setFriends] = useState([]);
	const [firstFriends, setFirstFriends] = useState([]);
	const [showFriends, setShowFriends] = useState(false);
	const [hideButton, setHideButton] = useState(true);

	useEffect(() => {
		axios
			.get(`http://localhost:5000/database/friends/${props.username}`)
			.then(res => {
				if (res.data.length > 0) {
					setFriends(res.data);
					setFirstFriends(res.data.slice(0, 4));
					if (res.data.length > 4) setHideButton(false);
				} else
					setFriends([
						{
							[props.userQuery]: `No friends found..`
						}
					]);
			});
	}, [showFriends]);

	const [newPasswordInput, setNewPasswordInput] = useState("");
	const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

	function updatePassword(e) {
		e.preventDefault();
		if (newPasswordInput === confirmPasswordInput) {
			const password = {
				password: newPasswordInput
			};
			axios
				.post(
					`http://localhost:5000/database/users/updatepassword/${props.username}`,
					password
				)
				.then(res => {
					setOpen(true);
					setNewPasswordInput("");
					setConfirmPasswordInput("");
				});
		}
	}

	const [open, setOpen] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};

	return (
		<div style={allContainer}>
			<p style={{ display: "inline" }}>Friends ({friends.length})</p>
			<Button onClick={props.addFriends}>Add More Friends</Button>
			{!hideButton ? (
				!showFriends ? (
					<Button
						style={{ textTransform: "none" }}
						onClick={() => setShowFriends(true)}
					>
						see all
					</Button>
				) : (
					<Button
						style={{ textTransform: "none" }}
						onClick={() => setShowFriends(false)}
					>
						see less
					</Button>
				)
			) : null}

			<Paper style={allContainer}>
				<ul style={{ padding: 0 }}>
					{showFriends
						? friends.map(friend => (
								<li style={{ listStyle: "none" }}>
									{friend.to_username}
								</li>
						  ))
						: firstFriends.map(friend => (
								<li style={{ listStyle: "none" }}>
									{friend.to_username}
								</li>
						  ))}
				</ul>
			</Paper>
			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<form onSubmit={updatePassword} style={allContainer}>
					<TextField
						id="outlined-password-input"
						label="New password"
						type="password"
						name="password"
						margin="normal"
						variant="outlined"
						value={newPasswordInput}
						onChange={e => setNewPasswordInput(e.target.value)}
					/>
					{newPasswordInput !== "" ? (
						<TextField
							id="outlined-password-input"
							label="Confirm password"
							type="password"
							name="password"
							margin="normal"
							variant="outlined"
							value={confirmPasswordInput}
							onChange={e =>
								setConfirmPasswordInput(e.target.value)
							}
						/>
					) : null}
					<Button type="submit">Update Password</Button>
				</form>
				<SnackBar
					message="Password have been changed"
					open={open}
					handleClose={() => handleClose()}
				/>

				<Button
					style={{
						height: "3em",
						marginTop: 60
					}}
					onClick={props.disconnect}
				>
					Sign out
				</Button>
			</div>
		</div>
	);
}
