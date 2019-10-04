const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
	User.find()
		.then(users => res.json(users))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/:username").get((req, res) => {
	User.find({ username: new RegExp(req.params.username) })
		.then(users => res.json(users))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/add").post((req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	const newUser = new User({ username, password });

	newUser
		.save()
		.then(() => res.json("Users added!"))
		.catch(err => res.status(400).json("Error : " + err));
});

router.route("/updatepassword/:username").post((req, res) => {
	User.findOne({ username: new RegExp(req.params.username) }).then(user => {
		user.username = req.params.username;
		user.password = req.body.password;

		console.log(user);

		user.save()
			.then(() => res.json("Users updated!"))
			.catch(err => res.status(400).json("Error : " + err));
	});
});

module.exports = router;
