import clients from "restify-clients";
import _ from "lodash";
import chalk from "chalk";
import FlatCache from "flat-cache";
import moment from "moment";
const userCredentialsCache = FlatCache.load("userCredentialsCache");

const client = clients.createJsonClient({
	url: "http://127.0.0.1:8080"
});

const strings = {
	loginInfo: username => chalk.cyan(`You are logged in as ${username}`),
	statusCode: statusCode => `Status code: ${statusCode}`,
	error: chalk.red.bold("Error"),
	success: chalk.green.bold("Success!"),
	unknownError: chalk.red("Sorry, something went wrong...")
};

function checkUserLoggedIn(
	message = "You must be logged in to complete this action"
) {
	const username = userCredentialsCache.getKey("username");
	const password = userCredentialsCache.getKey("password");

	if (username && password) {
		client.basicAuth(username, password);
	} else {
		console.log(chalk.red(message));
		return false;
	}
}

export function register(username, password, email) {
	console.log(`Registering as ${username}...\n`);

	//Build request body
	const reqBody = {
		username,
		password,
		email
	};

	client.post("/users", reqBody, function(err, req, res, obj) {
		let message;
		if (err) {
			message = _.get(
				err,
				"message",
				`${strings.error}: User not created`
			);

			console.log(chalk.red(message));
			return;
		}

		const user = obj.data.user;
		userCredentialsCache.setKey("username", user.username);
		userCredentialsCache.setKey("password", user.password);
		if (user.email) {
			userCredentialsCache.setKey("email", user.email);
		}
		userCredentialsCache.save();
		console.log(strings.success, strings.loginInfo(user.username));
	});
}

export function transactions(numTransactions) {
	numTransactions
		? console.log(`Getting last ${numTransactions} transactions...`)
		: console.log(`Getting all transactions...`);

	checkUserLoggedIn();

	client.get("/transactions", function(err, req, res, obj) {
		let message = ``;
		if (err) {
			if (res && res.statusCode == 401) {
				message = `Authorization error. Please try logging in again.`;
			} else {
				message = _.get(
					err,
					"message",
					`${strings.error}: Could not retrieve transactions`
				);
			}
			console.log(`\n${chalk.red(message)}`);
			return;
		}

		if (obj.data.length == 0) {
			message = "No transactions to display";
		} else {
			//TODO display this in a table, or otherwise well formatted
			obj.data.forEach(element => {
				message += `Transaction value: ${
					element.amount
				}, Date: ${moment(element.createdAt).format(
					"dddd, MMMM Do YYYY, h:mm a"
				)}\n`;
			});
			// message = JSON.stringify(obj.data, null, 2);
		}
		console.log(chalk.cyan(message));
	});
}

export function who() {
	const userInfo = userCredentialsCache.all();
	if (_.isEmpty(userInfo)) {
		console.log(chalk.cyan("No user is currently logged in"));
		return;
	}
	console.log(chalk.cyan("User info:"));
	console.log(JSON.stringify(userCredentialsCache.all(), null, 2));
}

export function login(username, password) {
	console.log(`Attempting login as ${username}...\n`);

	client.basicAuth(username, password);

	client.post("/login", function(err, req, res, obj) {
		let message;
		if (err) {
			if (res && res.statusCode == 401) {
				message = `Incorrect username or password.`;
			} else {
				message = _.get(
					err,
					"message",
					`${strings.error}: Could not log in.`
				);
			}
			console.log(`\n${chalk.red(message)}`);
			return;
		}
		const user = obj.data.user;
		userCredentialsCache.setKey("username", user.username);
		userCredentialsCache.setKey("password", user.password);
		if (user.email) {
			userCredentialsCache.setKey("email", user.email);
		}
		userCredentialsCache.save();
		console.log(strings.success, strings.loginInfo(user.username));
	});
}

export function logout() {
	FlatCache.clearCacheById("userCredentialsCache");
	console.log(chalk.cyan(`User logged out`));
}

export function withdraw(amount) {
	console.log(`Withdrawing $${amount} from your account...`);

	// make amount negative
	amount = `-${amount}`;

	checkUserLoggedIn();

	client.post(
		"/transactions/withdrawals",
		{
			amount
		},
		function(err, req, res, obj) {
			let message;
			if (err) {
				if (res && res.statusCode == 401) {
					message = `Authorization error. Please try logging in again.`;
				} else {
					message = _.get(
						err,
						"message",
						`${strings.error}: Could not complete withdrawal`
					);
				}
				console.log(`\n${chalk.red(message)}`);
				return;
			}

			console.log(JSON.stringify(obj, null, 2));
		}
	);
}

export function deposit(amount) {
	console.log(`Depositing ${amount} into your account...`);

	checkUserLoggedIn();

	client.post(
		"/transactions/deposits",
		{
			amount
		},
		function(err, req, res, obj) {
			let message;
			if (err) {
				if (res && res.statusCode == 401) {
					message = `Authorization error. Please try logging in again.`;
				} else {
					message = _.get(
						err,
						"message",
						`${strings.error}: Could not complete deposit`
					);
				}
				console.log(`\n${chalk.red(message)}`);
				return;
			}

			console.log(JSON.stringify(obj, null, 2));
		}
	);
}

export function getBalance() {
	console.log(`Getting acount balance...`);

	checkUserLoggedIn();

	//TODO put in an endpoint to just check balance
	client.get("/transactions", function(err, req, res, obj) {
		let message = ``;
		if (err) {
			if (res && res.statusCode == 401) {
				message = `Authorization error. Please try logging in again.`;
			} else {
				message = _.get(
					err,
					"message",
					`${strings.error}: Could not retrieve transactions`
				);
			}
			console.log(`\n${chalk.red(message)}`);
			return;
		}

		if (obj.meta.balance) {
			message = `Your account balance is ${obj.meta.balance}`;
		}
		console.log(chalk.cyan(message));
	});
}
