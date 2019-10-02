import React, { useState } from "react";

import Conversation from "./Conversation";
import CreateConversation from "./CreateConversation";
import SearchUserForm from "./SearchUserForm";

import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import MessageIcon from "@material-ui/icons/Message";
import ForumIcon from "@material-ui/icons/Forum";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

export default function MobileVersion(props) {
	const conversations = props.conversations;
	const [index, setIndex] = useState(conversations.length + 3);
	return (
		<React.Fragment>
			<AppBar
				position="fixed"
				style={{ justifyContent: "space-between" }}
			>
				<IconButton onClick={() => setIndex(conversations.length + 3)}>
					<ForumIcon />
				</IconButton>
				<div>
					<IconButton
						onClick={() => setIndex(conversations.length + 1)}
					>
						<MessageIcon />
					</IconButton>
					<IconButton
						onClick={() => setIndex(conversations.length + 2)}
					>
						<PersonAddIcon />
					</IconButton>
				</div>
			</AppBar>
			<Grid
				content
				xs="12"
				style={{
					marginTop: 60,
					display: "flex",
					flexDirection: "column"
				}}
			>
				{conversations.length + 3 === index
					? props.conversations.map((conversation, index) =>
							conversation.username === props.username ? (
								<React.Fragment>
									<Button
										fullWidth
										style={{
											textTransform: "none",
											margin: "10px 0px",
											justifyContent: "start"
										}}
										key={index}
										onClick={() => setIndex(index)}
									>
										{conversation.to_username}
									</Button>
									<Divider />
								</React.Fragment>
							) : (
								<React.Fragment>
									<Button
										style={{
											textTransform: "none",
											margin: "10px 0px",
											justifyContent: "start"
										}}
										key={index}
										onClick={() => setIndex(index)}
									>
										{conversation.username}
									</Button>
									<Divider />
								</React.Fragment>
							)
					  )
					: null}

				{conversations[index] !== undefined ? (
					conversations[index].username === props.username ? (
						<Conversation
							username={props.username}
							to_username={conversations[index].to_username}
							refreshScroll={props.refreshScroll}
						/>
					) : (
						<Conversation
							username={props.username}
							to_username={conversations[index].username}
							refreshScroll={props.refreshScroll}
						/>
					)
				) : null}

				{conversations.length + 1 === index ? (
					<form type="submit">
						<SearchUserForm
							username={props.username}
							users="friends"
							destination="conversations"
							userQuery="to_username"
							handleUpdateDb={props.handleUpdateDb}
							mobile={true}
							handleAction={() =>
								setIndex(conversations.length + 3)
							}
							handleClick={props.handleClick}
						/>
					</form>
				) : conversations.length + 2 === index ? (
					<form type="submit">
						<SearchUserForm
							username={props.username}
							users="users"
							destination="friends"
							userQuery="username"
							handleUpdateDb={props.handleUpdateDb}
							mobile={true}
							handleAction={() =>
								setIndex(conversations.length + 1)
							}
							handleClick={props.handleClick}
						/>
					</form>
				) : null}
			</Grid>
		</React.Fragment>
	);
}
