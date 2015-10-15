/* jshint node:true */
"use strict";

var _ = require("lodash");
var winston = require("winston");
var path = require("path");
var baseDir = path.resolve(__dirname, ".");

// Colora l'output (https://github.com/winstonjs/winston/issues/206)
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});

// Gestiamo manualmente i logger
var container = new winston.Container();

// Prepara il logger generico delle eccezioni
container.add("exception", {
	console: {
		handleExceptions: true,
		json: false,
		timestamp: false,
		colorize: true,
		label: "exception"
	}
});
container.get("exception").exitOnError = false;

// Crea su richiesta un logger specifico per un file
var keys = [];
var getLoggerByFilename = function(filename) {
	var label = path.relative(baseDir, filename);
	if (!_.contains(keys, label)) {
		container.add(label, {
			console: {
				handleExceptions: false,
				level: "debug",
				timestamp: false,
				label: label,
				colorize: true
			}
		});
		keys.push(label);
	}
	var logger = container.get(label);
	logger.exitOnError = false;
	return logger;
};

module.exports = getLoggerByFilename;
