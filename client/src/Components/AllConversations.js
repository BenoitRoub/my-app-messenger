import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Conversation from "./Conversation";
import CreateConversation from "./CreateConversation";
import SearchUserForm from "./SearchUserForm";
import MobileVersion from "./MobileVersion.js";

import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CloseIcon from "@material-ui/icons/Close";

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
		borderRight: `1px solid ${theme.palette.divider}`
	}
}));

export default function AllConversations({ match }) {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

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
			.get(`http://localhost:5000/conversations/${match.params.username}`)
			.then(res => {
				if (res.data.length > 0) {
					setConversations(res.data);
				}
			});
	}, [updateDb]);

	const [refreshScroll, setRefreshScroll] = useState(false);
	const [windowWidthQuery, setWindowWidthQuery] = useState();

	useEffect(() => setWindowWidthQuery(window.innerWidth), []);

	if (windowWidthQuery > 450)
		return (
			<Grid container justify="center">
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
						{conversations.map((conversation, index) =>
							conversation.username === match.params.username ? (
								<Tab
									style={{ textTransform: "none" }}
									key={index}
									label={conversation.to_username}
									{...a11yProps(index)}
								/>
							) : (
								<Tab
									style={{ textTransform: "none" }}
									key={index}
									label={conversation.username}
									{...a11yProps(index)}
								/>
							)
						)}
						<Tab
							label="Start a discussion"
							{...a11yProps(conversations.length)}
						/>
						<Tab
							label="Add friends.."
							{...a11yProps(conversations.length + 1)}
						/>
					</Tabs>
				</Grid>
				<Grid item sm={8} style={{ overflow: "auto", height: "100vh" }}>
					{conversations.map((conversation, index) =>
						conversation.username === match.params.username ? (
							<TabPanel value={value} index={index} key={index}>
								<Conversation
									username={match.params.username}
									to_username={conversation.to_username}
									refreshScroll={refreshScroll}
								/>
							</TabPanel>
						) : (
							<TabPanel value={value} index={index} key={index}>
								<Conversation
									username={match.params.username}
									to_username={conversation.username}
									refreshScroll={refreshScroll}
								/>
							</TabPanel>
						)
					)}
					<TabPanel value={value} index={conversations.length}>
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
									setValue(conversations.length)
								}
								handleClick={() => handleClick()}
							/>
						</form>
					</TabPanel>
					<TabPanel value={value} index={conversations.length + 1}>
						<form type="submit">
							<SearchUserForm
								username={match.params.username}
								users="users"
								destination="friends"
								userQuery="username"
								handleUpdateDb={updateDb =>
									setUpdateDb(!updateDb)
								}
								handleAction={() => setValue(value - 1)}
								handleClick={() => handleClick()}
							/>
						</form>
					</TabPanel>
				</Grid>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
					open={open}
					autoHideDuration={3000}
					onClose={handleClose}
				>
					<SnackbarContent
						variant="success"
						aria-describedby="client-snackbar"
						message={<span id="client-snackbar">Added</span>}
					/>
				</Snackbar>
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
					handleClick={() => handleClick()}
				/>
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}
					open={open}
					autoHideDuration={3000}
					onClose={handleClose}
				>
					<SnackbarContent
						variant="success"
						aria-describedby="client-snackbar"
						message={<span id="client-snackbar">Added</span>}
					/>
				</Snackbar>
			</Grid>
		);
}
