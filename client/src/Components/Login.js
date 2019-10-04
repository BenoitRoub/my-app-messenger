import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";

import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export default function Login() {
	const [usernameInput, setUsernameInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [username, setUsername] = useState("");

	const [isLogged, setIsLogged] = useState(false);

	const [wrongInformations, setWrongInformations] = useState(false);
	const [wrongUsername, setWrongUsername] = useState(false);
	const [wrongPasswords, setWrongPasswords] = useState(false);

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = "expires=" + d.toUTCString();
		document.cookie =
			cname +
			"=" +
			cvalue +
			";" +
			expires +
			`;path=/conversations/${cvalue}`;
		console.log(
			cname +
				"=" +
				cvalue +
				";" +
				expires +
				`;path=/conversations/${cvalue}`
		);
	}

	const dispatch = useDispatch();

	function connect(e) {
		e.preventDefault();
		axios
			.get(`http://localhost:5000/database/users/${usernameInput}`)
			.then(res => {
				if (res.data.length > 0) {
					if (res.data[0].password === passwordInput) {
						setUsername(usernameInput);
						setCookie("username", usernameInput, 3);
						dispatch({ type: "logged", username: usernameInput });
						setIsLogged(true);
					} else setWrongInformations(true);
				} else setWrongInformations(true);
			});

		setUsernameInput("");
		setPasswordInput("");
	}

	const [usernameInputRegister, setUsernameInputRegister] = useState("");
	const [passwordInputRegister, setPasswordInputRegister] = useState("");
	const [
		confirmPasswordInputRegister,
		setConfirmPasswordInputRegister
	] = useState("");

	function Register(e) {
		e.preventDefault();
		if (passwordInputRegister === confirmPasswordInputRegister) {
			const user = {
				username: usernameInputRegister,
				password: passwordInputRegister
			};

			axios
				.post("http://localhost:5000/database/users/add", user)
				.then(res =>
					res
						? (setUsername(usernameInputRegister),
						  setCookie("username", usernameInputRegister, 3),
						  dispatch({ type: "logged", username: usernameInput }),
						  setIsLogged(true))
						: null
				)
				.then(
					!isLogged
						? (setWrongUsername(true), setWrongPasswords(false))
						: null
				);

			setUsernameInputRegister("");
			setPasswordInputRegister("");
			setConfirmPasswordInputRegister("");
		} else {
			setPasswordInputRegister("");
			setConfirmPasswordInputRegister("");
			setWrongPasswords(true);
			setWrongUsername(false);
		}
	}

	const [login, setLogin] = useState(true);

	if (isLogged) {
		return <Redirect to={`/conversations/${username}`} />;
	} else {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh"
				}}
			>
				{login ? (
					<Grid item sm="6" xs="9">
						<Paper style={{ padding: "30px" }}>
							<form
								style={{
									display: "flex",
									flexDirection: "Column",
									alignItems: "center"
								}}
								onSubmit={connect}
							>
								<TextField
									id="outlined-email-input"
									label="Username"
									type="text"
									name="text"
									autoComplete="text"
									margin="normal"
									variant="outlined"
									value={usernameInput}
									onChange={e =>
										setUsernameInput(e.target.value)
									}
								/>
								<TextField
									id="outlined-password-input"
									label="Password"
									type="password"
									autoComplete="current-password"
									margin="normal"
									variant="outlined"
									value={passwordInput}
									onChange={e =>
										setPasswordInput(e.target.value)
									}
								/>
								{wrongInformations ? (
									<p style={{ color: "#d42424" }}>
										Username or Password incorrect
									</p>
								) : null}
								<Button type="submit">Log in</Button>
								<Button
									style={{ textTransform: "none" }}
									onClick={() => setLogin(false)}
								>
									No account ? Register now
								</Button>
							</form>
						</Paper>
					</Grid>
				) : (
					<Grid item sm="6" xs="9">
						<Paper
							style={{
								padding: "30px"
							}}
						>
							<form
								style={{
									display: "flex",
									flexDirection: "Column",
									alignItems: "center"
								}}
								onSubmit={Register}
							>
								<TextField
									id="outlined-email-input"
									label="Username"
									type="text"
									name="text"
									autoComplete="text"
									margin="normal"
									variant="outlined"
									value={usernameInputRegister}
									onChange={e =>
										setUsernameInputRegister(e.target.value)
									}
								/>
								<TextField
									id="outlined-password-input"
									label="Password"
									type="password"
									autoComplete="current-password"
									margin="normal"
									variant="outlined"
									value={passwordInputRegister}
									onChange={e =>
										setPasswordInputRegister(e.target.value)
									}
								/>
								<TextField
									id="outlined-password-input"
									label="Confirm Password"
									type="password"
									autoComplete="current-password"
									margin="normal"
									variant="outlined"
									value={confirmPasswordInputRegister}
									onChange={e =>
										setConfirmPasswordInputRegister(
											e.target.value
										)
									}
								/>

								{wrongPasswords ? (
									<p style={{ color: "#d42424" }}>
										passwords doesn't match
									</p>
								) : null}

								{!isLogged && wrongUsername
									? (console.log(!isLogged && wrongUsername),
									  (
											<p style={{ color: "#d42424" }}>
												this username is already taken
											</p>
									  ))
									: null}

								<Button type="submit">Register</Button>
								<Button
									style={{ textTransform: "none" }}
									onClick={() => setLogin(true)}
								>
									already have an account ?
								</Button>
							</form>
						</Paper>
					</Grid>
				)}
			</div>
		);
	}
}
