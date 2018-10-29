#!/usr/bin/env node
"use strict";

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _commands = require("./controllers/commands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();


_commander2.default.version(process.env.VERSION).description(process.env.DESCRIPTION);

// error on unknown commands
_commander2.default.on("command:*", function () {
	console.error("Invalid command: " + _commander2.default.args.join(" ") + "\nSee --help for a list of available commands.");
	process.exit(1);
});

_commander2.default.command("register <username> <password> [email]").alias("reg").description("Register a new username and password").action(_commands.register);

_commander2.default.command("login <username> <password>").alias("li").description("Log in using your username and password").action(_commands.login);

_commander2.default.command("who").alias("w").description("Show the currently logged in user, if any").action(_commands.who);

_commander2.default.command("logout").alias("lo").description("Log out of the current session").action(_commands.logout);

_commander2.default.command("deposit <amount>").alias("dep").description("Deposit money into your account").action(_commands.deposit);

_commander2.default.command("withdraw <amount>").alias("wd").description("Withdraw money from your account").action(_commands.withdraw);

_commander2.default.command("history [number-of-transactions]").alias("his").description("See your transaction history").action(_commands.transactions);

_commander2.default.command("balance").alias("bal").description("Check your account balance").action(_commands.getBalance);

// Display help if no arguments supplied
if (!process.argv.slice(2).length) {
	_commander2.default.help();
}

_commander2.default.parse(process.argv);