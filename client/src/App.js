import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AllConversations from "./Components/AllConversations";
import Conversation from "./Components/Conversation";
import UserProfile from "./Components/UserProfile";
import Login from "./Components/Login";
import css from "./App.css";

function App() {
	return (
		<Router>
			<div
				className="App"
				style={{ background: "#fafafa", minHeight: "100vh" }}
			>
				<Route path="/" exact component={Login} />
				<Route
					path="/conversations/:username"
					component={AllConversations}
				/>
				<Route path="/UserProfile" component={UserProfile} />
			</div>
		</Router>
	);
}

export default App;
