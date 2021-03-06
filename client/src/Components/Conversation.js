import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";

const allContainer = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center"
};
const containerMessage = {
	padding: 8,
	width: "100%",
	display: "flex"
};
const containerMessageSend = {
	padding: 8,
	width: "100%",
	display: "flex",
	justifyContent: "flex-end"
};
const messageSend = {
	marginLeft: "40%",
	listStyle: "none",
	borderRadius: "10px",
	background: "#4343ff",
	color: "white",
	display: "inline",
	padding: 8
};
const messageReceive = {
	marginRight: "40%",
	listStyle: "none",
	borderRadius: "10px",
	background: "#eae4d9",
	display: "inline",
	padding: 8
};
const containerSearchBar = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center"
};
const inputStyle = {
	padding: "5px 20px"
};

export default function Conversation(props) {
	const [messages, setMessages] = useState([]);
	const [oldMessages, setOldMessages] = useState([]);
	const [updateMessageFromDB, setUpdateMessageFromDB] = useState(1);

	useEffect(() => {
		var refreshMessage = setInterval(() => {
			setUpdateMessageFromDB(Math.random());
		}, 1000);
		return function cleanup() {
			clearInterval(refreshMessage);
		};
	}, []);

	useEffect(() => {
		axios
			.get(`/database/messages/${props.username}/${props.to_username}`)
			.then(res => {
				if (res.data.length > 0) {
					setMessages(res.data);
				}
			});
	}, [updateMessageFromDB]);

	const [messageInput, setMessageInput] = useState("");

	function sendMessage(e) {
		e.preventDefault();

		const date = new Date();

		const message = {
			message: messageInput,
			username: props.username,
			to_username: props.to_username,
			date: date
		};

		axios.post("/database/messages/add", message).then(res => {
			setUpdateMessageFromDB(!updateMessageFromDB);
			if (
				message.to_username ===
				"TestAccountFeelFreeToAddAndTestMessages"
			) {
				const messageAuto = {
					message: "This is an automatic response.",
					username: "TestAccountFeelFreeToAddAndTestMessages",
					to_username: props.username,
					date: date
				};
				axios.post("/database/messages/add", messageAuto);
			}
			if (message.to_username === "TestProfileFeelFreeToSendMessage") {
				const messageAuto = {
					message: "This is an automatic response.",
					username: "TestProfileFeelFreeToSendMessage",
					to_username: props.username,
					date: date
				};
				axios.post("/database/messages/add", messageAuto);
			}
		});

		setMessageInput("");
	}

	useEffect(() => {
		if (oldMessages.length !== messages.length) setOldMessages(messages);
	});

	const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "instant" });
	};
	useEffect(scrollToBottom, [oldMessages]);
	useEffect(scrollToBottom, [props.refreshScroll]);

	if (props.to_username) {
		return (
			<div style={allContainer}>
				<ul style={{ width: "85%" }}>
					{messages.map(message =>
						message.username === props.username ? (
							<React.Fragment>
								<div
									style={containerMessageSend}
									key={message._id}
								>
									<li style={messageSend}>
										{message.message}
									</li>
								</div>
							</React.Fragment>
						) : (
							<React.Fragment>
								<div style={containerMessage} key={message._id}>
									<li style={messageReceive}>
										{message.message}
									</li>
								</div>
							</React.Fragment>
						)
					)}
				</ul>
				<form onSubmit={sendMessage}>
					<Paper style={containerSearchBar}>
						<InputBase
							style={inputStyle}
							placeholder="Enter a message..."
							inputProps={{
								"aria-label": "description"
							}}
							autoFocus
							value={messageInput}
							onChange={e => setMessageInput(e.target.value)}
						/>
						<div ref={messagesEndRef} />
					</Paper>
				</form>
			</div>
		);
	} else return null;
}
