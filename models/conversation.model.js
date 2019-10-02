const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
	{
		username: {
			type: String,
			required: true
		},
		to_username: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
