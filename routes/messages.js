const router = require("express").Router();
let Message = require("../models/message.model");

router.route("/").get((req, res) => {
	Message.find()
		.then(messages => res.json(messages))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/add").post((req, res) => {
	const username = req.body.username;
	const to_username = req.body.to_username;
	const message = req.body.message;
	const date = Date.parse(req.body.date);

	const newMessage = new Message({
		username,
		to_username,
		message,
		date
	});

	newMessage
		.save()
		.then(() => res.json("Message added!"))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/:username/:to_username").get((req, res) => {
	Message.find({
		$or: [
			{
				username: req.params.username,
				to_username: req.params.to_username
			},
			{
				username: req.params.to_username,
				to_username: req.params.username
			}
		]
	})
		.then(message => res.json(message))
		.catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
	Message.findByIdAndDelete(req.params.id)
		.then(message => res.json("Exercise deleted."))
		.catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
