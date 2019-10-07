import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import Conversation from "./Conversation";
import CreateConversation from "./CreateConversation";
import SearchUserForm from "./SearchUserForm";
import UserProfile from "./UserProfile";
import MobileVersion from "./MobileVersion.js";
import SnackBar from "./MaterialUIComponent/SnackBar";

import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			<Box p={3}>{children}</Box>
		</Typography>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`
	};
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: "flex",
		height: 224
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		overflow: "auto",
		height: "100vh"
	}
}));

export default function AllConversations({ match }) {
	const [open, setOpen] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
	};
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const [conversations, setConversations] = useState([]);

	const [updateDb, setUpdateDb] = useState(false);

	useEffect(() => {
		var refreshMessage = setInterval(() => {
			setUpdateDb(Math.random());
		}, 1000);
		return function cleanup() {
			clearInterval(refreshMessage);
		};
	}, []);

	useEffect(() => {
		axios
			.get(`/database/conversations/${match.params.username}`)
			.then(res => {
				if (res.data.length > 0) {
					setConversations(res.data);
				}
			});
	}, [updateDb]);

	const [refreshScroll, setRefreshScroll] = useState(false);
	const [windowWidthQuery, setWindowWidthQuery] = useState();

	useEffect(() => setWindowWidthQuery(window.innerWidth), []);

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
	}

	const [notConnected, setNotConnected] = useState(false);
	const reduxUsername = useSelector(state => state.user.username);
	const [refreshCookie, setRefreshCookie] = useState(false);

	useEffect(() => {
		if (reduxUsername !== match.params.username) {
			if ("username=" + match.params.username !== document.cookie) {
				setNotConnected(true);
			}
		} else setCookie("username", match.params.username, 3);
	}, [refreshCookie]);

	const dispatch = useDispatch();

	function disconnect() {
		document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/conversations/${match.params.username}`;
		dispatch({ type: "disconnect" });
		setRefreshCookie(!refreshCookie);
	}

	if (windowWidthQuery > 450)
		return (
			<Grid container justify="center">
				{notConnected ? <Redirect to="/" /> : null}
				<Grid sm={3} style={{ height: "90vh" }}>
					<Tabs
						orientation="vertical"
						variant="scrollable"
						value={value}
						onChange={handleChange}
						onClick={() => setRefreshScroll(!refreshScroll)}
						aria-label="Vertical tabs example"
						className={classes.tabs}
					>
						<Tab label="Profile" {...a11yProps(0)} />
						<Tab label="Add friends.." {...a11yProps(1)} />
						<Tab label="Start a discussion" {...a11yProps(2)} />
						{conversations.map((conversation, index) =>
							conversation.username === match.params.username ? (
								<Tab
									style={{ textTransform: "none" }}
									key={index}
									label={conversation.to_username}
									{...a11yProps(index + 3)}
								/>
							) : (
								<Tab
									style={{ textTransform: "none" }}
									key={index}
									label={conversation.username}
									{...a11yProps(index + 3)}
								/>
							)
						)}
					</Tabs>
				</Grid>
				<Grid item sm={8} style={{ overflow: "auto", height: "100vh" }}>
					{conversations.map((conversation, index) =>
						conversation.username === match.params.username ? (
							<TabPanel
								value={value}
								index={index + 3}
								key={index}
							>
								<Conversation
									username={match.params.username}
									to_username={conversation.to_username}
									refreshScroll={refreshScroll}
								/>
							</TabPanel>
						) : (
							<TabPanel
								value={value}
								index={index + 3}
								key={index}
							>
								<Conversation
									username={match.params.username}
									to_username={conversation.username}
									refreshScroll={refreshScroll}
								/>
							</TabPanel>
						)
					)}
					<TabPanel value={value} index={0}>
						<UserProfile
							username={match.params.username}
							disconnect={() => disconnect()}
							addFriends={() => setValue(1)}
						/>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<form type="submit">
							<SearchUserForm
								username={match.params.username}
								users="users"
								destination="friends"
								userQuery="username"
								handleUpdateDb={updateDb =>
									setUpdateDb(!updateDb)
								}
								handleAction={() => setValue(value + 1)}
								handleClick={() => setOpen(true)}
							/>
						</form>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<form type="submit">
							<SearchUserForm
								username={match.params.username}
								users="friends"
								destination="conversations"
								userQuery="to_username"
								handleUpdateDb={updateDb =>
									setUpdateDb(!updateDb)
								}
								handleAction={() =>
									setValue(conversations.length + 2)
								}
								handleClick={() => setOpen(true)}
							/>
						</form>
					</TabPanel>
				</Grid>
				<SnackBar
					message="Added"
					open={open}
					handleClose={() => handleClose()}
				/>
			</Grid>
		);
	else
		return (
			<Grid container xs="12" style={{ padding: "20px" }}>
				<MobileVersion
					conversations={conversations}
					username={match.params.username}
					handleUpdateDb={updateDb => setUpdateDb(!updateDb)}
					refreshScroll={refreshScroll}
					handleClick={() => setOpen(true)}
				/>
				<SnackBar
					message="Added"
					open={open}
					handleClose={() => handleClose()}
				/>
			</Grid>
		);
}
