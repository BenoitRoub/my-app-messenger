import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

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

	function connect(e) {
		e.preventDefault();
		axios.get(`http://localhost:5000/users/${usernameInput}`).then(res => {
			if (res.data.length > 0) {
				if (res.data[0].password === passwordInput) {
					setUsername(usernameInput);
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
		console.log(passwordInputRegister);
		console.log(confirmPasswordInputRegister);
		if (passwordInputRegister === confirmPasswordInputRegister) {
			e.preventDefault();

			const user = {
				username: usernameInputRegister,
				password: passwordInputRegister
			};

			axios
				.post("http://localhost:5000/users/add", user)
				.then(res =>
					res
						? (setUsername(usernameInputRegister),
						  setIsLogged(true))
						: null
				);

			setUsernameInputRegister("");
			setPasswordInputRegister("");
			setConfirmPasswordInputRegister("");
		} else {
			setPasswordInputRegister("");
			setConfirmPasswordInputRegister("");
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
									flexDirection: "Column"
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
								<Button type="submit">Log in</Button>
								<Button onClick={() => setLogin(false)}>
									Or create an account
								</Button>
							</form>

							{wrongInformations ? (
								<p>Username or Password incorrect</p>
							) : null}
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
									flexDirection: "Column"
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
									label="Password"
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

								<Button type="submit">submit</Button>
							</form>
						</Paper>
					</Grid>
				)}
			</div>
		);
	}
}
