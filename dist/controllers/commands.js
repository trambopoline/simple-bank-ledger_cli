"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.register = register;
exports.transactions = transactions;
exports.who = who;
exports.login = login;
exports.logout = logout;
exports.withdraw = withdraw;
exports.deposit = deposit;
exports.getBalance = getBalance;

var _restifyClients = require("restify-clients");

var _restifyClients2 = _interopRequireDefault(_restifyClients);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _flatCache = require("flat-cache");

var _flatCache2 = _interopRequireDefault(_flatCache);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userCredentialsCache = _flatCache2.default.load("userCredentialsCache");

var client = _restifyClients2.default.createJsonClient({
	url: "http://127.0.0.1:8080"
});

var strings = {
	loginInfo: function loginInfo(username) {
		return _chalk2.default.cyan("You are logged in as " + username);
	},
	statusCode: function statusCode(_statusCode) {
		return "Status code: " + _statusCode;
	},
	error: _chalk2.default.red.bold("Error"),
	success: _chalk2.default.green.bold("Success!"),
	unknownError: _chalk2.default.red("Sorry, something went wrong...")
};

function checkUserLoggedIn() {
	var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "You must be logged in to complete this action";

	var username = userCredentialsCache.getKey("username");
	var password = userCredentialsCache.getKey("password");

	if (username && password) {
		client.basicAuth(username, password);
	} else {
		console.log(_chalk2.default.red(message));
		return false;
	}
}

function register(username, password, email) {
	console.log("Registering as " + username + "...\n");

	//Build request body
	var reqBody = {
		username: username,
		password: password,
		email: email
	};

	client.post("/users", reqBody, function (err, req, res, obj) {
		var message = void 0;
		if (err) {
			message = _lodash2.default.get(err, "message", strings.error + ": User not created");

			console.log(_chalk2.default.red(message));
			return;
		}

		var user = obj.data.user;
		userCredentialsCache.setKey("username", user.username);
		userCredentialsCache.setKey("password", user.password);
		if (user.email) {
			userCredentialsCache.setKey("email", user.email);
		}
		userCredentialsCache.save();
		console.log(strings.success, strings.loginInfo(user.username));
	});
}

function transactions(numTransactions) {
	numTransactions ? console.log("Getting last " + numTransactions + " transactions...") : console.log("Getting all transactions...");

	checkUserLoggedIn();

	client.get("/transactions", function (err, req, res, obj) {
		var message = "";
		if (err) {
			if (res && res.statusCode == 401) {
				message = "Authorization error. Please try logging in again.";
			} else {
				message = _lodash2.default.get(err, "message", strings.error + ": Could not retrieve transactions");
			}
			console.log("\n" + _chalk2.default.red(message));
			return;
		}

		if (obj.data.length == 0) {
			message = "No transactions to display";
		} else {
			//TODO display this in a table, or otherwise well formatted
			obj.data.forEach(function (element) {
				message += "Transaction value: " + element.amount + ", Date: " + (0, _moment2.default)(element.createdAt).format("dddd, MMMM Do YYYY, h:mm a") + "\n";
			});
			// message = JSON.stringify(obj.data, null, 2);
		}
		console.log(_chalk2.default.cyan(message));
	});
}

function who() {
	var userInfo = userCredentialsCache.all();
	if (_lodash2.default.isEmpty(userInfo)) {
		console.log(_chalk2.default.cyan("No user is currently logged in"));
		return;
	}
	console.log(_chalk2.default.cyan("User info:"));
	console.log(JSON.stringify(userCredentialsCache.all(), null, 2));
}

function login(username, password) {
	console.log("Attempting login as " + username + "...\n");

	client.basicAuth(username, password);

	client.post("/login", function (err, req, res, obj) {
		var message = void 0;
		if (err) {
			if (res && res.statusCode == 401) {
				message = "Incorrect username or password.";
			} else {
				message = _lodash2.default.get(err, "message", strings.error + ": Could not log in.");
			}
			console.log("\n" + _chalk2.default.red(message));
			return;
		}
		var user = obj.data.user;
		userCredentialsCache.setKey("username", user.username);
		userCredentialsCache.setKey("password", user.password);
		if (user.email) {
			userCredentialsCache.setKey("email", user.email);
		}
		userCredentialsCache.save();
		console.log(strings.success, strings.loginInfo(user.username));
	});
}

function logout() {
	_flatCache2.default.clearCacheById("userCredentialsCache");
	console.log(_chalk2.default.cyan("User logged out"));
}

function withdraw(amount) {
	console.log("Withdrawing $" + amount + " from your account...");

	// make amount negative
	amount = "-" + amount;

	checkUserLoggedIn();

	client.post("/transactions/withdrawals", {
		amount: amount
	}, function (err, req, res, obj) {
		var message = void 0;
		if (err) {
			if (res && res.statusCode == 401) {
				message = "Authorization error. Please try logging in again.";
			} else {
				message = _lodash2.default.get(err, "message", strings.error + ": Could not complete withdrawal");
			}
			console.log("\n" + _chalk2.default.red(message));
			return;
		}

		console.log(JSON.stringify(obj, null, 2));
	});
}

function deposit(amount) {
	console.log("Depositing " + amount + " into your account...");

	checkUserLoggedIn();

	client.post("/transactions/deposits", {
		amount: amount
	}, function (err, req, res, obj) {
		var message = void 0;
		if (err) {
			if (res && res.statusCode == 401) {
				message = "Authorization error. Please try logging in again.";
			} else {
				message = _lodash2.default.get(err, "message", strings.error + ": Could not complete deposit");
			}
			console.log("\n" + _chalk2.default.red(message));
			return;
		}

		console.log(JSON.stringify(obj, null, 2));
	});
}

function getBalance() {
	console.log("Getting acount balance...");

	checkUserLoggedIn();

	//TODO put in an endpoint to just check balance
	client.get("/transactions", function (err, req, res, obj) {
		var message = "";
		if (err) {
			if (res && res.statusCode == 401) {
				message = "Authorization error. Please try logging in again.";
			} else {
				message = _lodash2.default.get(err, "message", strings.error + ": Could not retrieve transactions");
			}
			console.log("\n" + _chalk2.default.red(message));
			return;
		}

		if (obj.meta.balance) {
			message = "Your account balance is " + obj.meta.balance;
		}
		console.log(_chalk2.default.cyan(message));
	});
}