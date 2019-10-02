const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ... other imports
const path = require("path");

// ... other app.use middleware
app.use(express.static(path.join(__dirname, "client", "build")));

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
	console.log("mongoDB database connection established succesfully");
});

const messagesRouter = require("./routes/messages");
const usersRouter = require("./routes/users");
const conversationsRouter = require("./routes/conversations");
const friendsRouter = require("./routes/friends");

app.use("/messages", messagesRouter);
app.use("/users", usersRouter);
app.use("/conversations", conversationsRouter);
app.use("/friends", friendsRouter);

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
	console.log(`Server is running on port : ${port}`);
});
