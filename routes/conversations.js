const router = require("express").Router();
let Conversation = require("../models/conversation.model");

router.route("/:username").get((req, res) => {
	Conversation.find({
		$or: [
			{ to_username: req.params.username },
			{ username: req.params.username }
		]
	})
		.then(conversations => res.json(conversations))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/add").post((req, res) => {
	const username = req.body.username;
	const to_username = req.body.to_username;

	const newConversation = new Conversation({
		username,
		to_username
	});

	newConversation
		.save()
		.then(() => res.json("Conversation added!"))
		.catch(err => res.status(400).json("Error : " + err));
});

module.exports = router;
