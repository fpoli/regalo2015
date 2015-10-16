/* jshint node:true */
"use strict";

// Generic error handler
process.on("uncaughtException", function(err) {
    console.error("Uncaught exception");
    console.error(err.stack);
});

String.prototype.replaceAt = function(index, character) {
	return this.substr(0, index) + character + this.substr(index + character.length);
};

function clone(a) {
	return JSON.parse(JSON.stringify(a));
}

function clamp(val, min, max) {
	return Math.max(min, Math.min(max, val));
}

var express = require("express");
var app = express();

var config = {
	password: "g10V4nN1",
	map: {
		width: 30,
		height: 30,
		view:[
			".......#...#...#..............",
			".........#...#................",
			".......#...#...#..............",
			".........#...#................",
			".......#...#...#..............",
			"#################.............",
			"..............................",
			"............#################.",
			"......#######.................",
			"............#.................",
			"............#...........######",
			"........................#.....",
			"#####################...#.....",
			"........................#.....",
			"........................#.....",
			"..........###############.....",
			"..............................",
			"..........##..................",
			"..............................",
			"..........#############.......",
			".....................#........",
			"..........##########.#........",
			"...................#.#........",
			"..........##.......#..#.......",
			"########...#.......#..#.......",
			".......#############..#.......",
			"......................########",
			"...####################.......",
			".###....###....##....##.....#.",
			".....##.....##....##........#."
		]
	}
};

var state = {
	map: {},
	password: {
		x: config.map.width - 1,
		y: config.map.height - 1
	},
	giove: {
		position: {
			x: 0,
			y: 0
		},
		memory: ""
	}
};
updateMapInState();

function updateMapInState() {
	state.map = clone(config.map);

	state.map.view[state.password.y] = 
		state.map.view[state.password.y]
			.replaceAt(state.password.x, "P");

	state.map.view[state.giove.position.y] = 
		state.map.view[state.giove.position.y]
			.replaceAt(state.giove.position.x, "G");
}

function moveGiove(dx, dy) {
	var newx = state.giove.position.x + dx;
	var newy = state.giove.position.y + dy;

	newx = clamp(newx, 0, config.map.width-1);
	newy = clamp(newy, 0, config.map.height-1);

	if (state.map.view[newy][newx] !== "#") {
		state.giove.position.x = newx;
		state.giove.position.y = newy;
	}

	if (state.giove.position.x === state.password.x &&
	    state.giove.position.y === state.password.y) {
		state.giove.memory = config.password;
	} else {
		state.giove.memory = "";
	}

	updateMapInState();
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

app.get("/giove/state", function(req, res) {
	res.type("application/json");
	res.send(JSON.stringify(state, null, 4));
});

app.get("/giove/action", function(req, res) {
	var action = req.query.move;
	if (action === "up") {
		moveGiove(0, -1); // Y goes downward
		res.send("Ok.");
	} else
	if (action === "down") {
		moveGiove(0, +1); // Y goes downward
		res.send("Ok.");
	} else
	if (action === "left") {
		moveGiove(-1, 0);
		res.send("Ok.");
	} else
	if (action === "right") {
		moveGiove(+1, 0);
		res.send("Ok.");
	} else
	res.status(400).send("Aaargh! Fermati sciocco!");
});

app.get("/giove/reset", function(req, res) {
	state.giove.position.x = 0;
	state.giove.position.y = 0;
	updateMapInState();
	res.send("Ok.");
});

app.get("/giove/commands", function(req, res) {
	res.render("commands");
});

app.listen(app.get("port"), function() {
	console.log("Node app is running on port", app.get("port"));
});
