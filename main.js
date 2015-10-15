/* jshint node:true */
"use strict";

var logger = require("./logger")("main");
var express = require("express");
var app = express();

var config = {
	password: "g10V4nN1"
};

var state = {
	map: {
		width: 10,
		height: 10,
		walls:[
			"..........",
			"..........",
			"..........",
			"..........",
			"..........",
			"..........",
			"..........",
			"..........",
			"..........",
			".........."
		]
	},
	password: {
		x: 9,
		y: 9
	},
	robot: {
		position: {
			x: 0,
			y: 0
		},
		memory: ""
	}
};

function clamp(val, min, max) {
	return Math.max(min, Math.min(max, val));
}

function moveRobot(dx, dy) {
	var newx = state.robot.position.x + dx;
	var newy = state.robot.position.y + dy;

	newx = clamp(newx, 0, state.map.width-1);
	newy = clamp(newy, 0, state.map.height-1);

	if (state.map.walls[newy][newx] === ".") {
		state.robot.position.x = newx;
		state.robot.position.y = newy;
	}

	if (state.robot.position.x === state.password.x &&
	    state.robot.position.y === state.password.y) {
		state.robot.memory = config.password;
	} else {
		state.robot.memory = "";
	}
}

app.set("port", (process.env.PORT || 5000));

app.use(express.static(__dirname + "/public"));

// views is directory for all template files
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("ask-password");
});

app.get("/profile", function(req, res) {
	if (req.query.password === config.password) {
		res.render("good-password");
	} else {
		res.render("wrong-password");
	}
});

app.get("/recovery", function(req, res) {
	res.render("recovery");
});

app.get("/robot/state", function(req, res) {
	res.json(state);
});

app.get("/robot/action", function(req, res) {
	var action = req.query.move;
	if (action === "up") {
		moveRobot(0, -1); // Y goes downward
		res.send("Ok.");
	} else
	if (action === "down") {
		moveRobot(0, +1); // Y goes downward
		res.send("Ok.");
	} else
	if (action === "left") {
		moveRobot(-1, 0);
		res.send("Ok.");
	} else
	if (action === "right") {
		moveRobot(+1, 0);
		res.send("Ok.");
	} else
	res.status(400).send("Aaargh! Fermati! Se continui così romperai il robot!");
});

app.listen(app.get("port"), function() {
	console.log("Node app is running on port", app.get("port"));
});
