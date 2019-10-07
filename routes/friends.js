const router = require("express").Router();
let Friend = require("../models/friend.model");

router.route("/:username").get((req, res) => {
	Friend.find({ username: req.params.username })
		.then(friends => res.json(friends))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/:username/:to_username").get((req, res) => {
	Friend.find({
		$and: [
			{
				username: req.params.username
			},
			{ to_username: new RegExp(req.params.to_username, "i") }
		]
	})
		.then(friends => res.json(friends))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/add").post((req, res) => {
	const username = req.body.username;
	const to_username = req.body.to_username;

	const newFriend = new Friend({
		username,
		to_username
	});

	newFriend
		.save()
		.then(() => res.json("Friends added!"))
		.catch(err => res.status(400).json("Error : " + err));
});

module.exports = router;
