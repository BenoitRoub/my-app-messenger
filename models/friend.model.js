const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			minLength: 3
		},
		to_username: {
			type: String,
			required: true,
			trim: true,
			minLength: 3
		}
	},
	{
		timestamps: true
	}
);

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
