import clients from "restify-clients";
import _ from "lodash";
import chalk from "chalk";
import NodeCache from "node-cache";
const userCredentialsCache = new NodeCache();

const client = clients.createJsonClient({
	url: "http://127.0.0.1:8080"
});

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
				`Status code: ${res.statusCode}\nERROR: User not created`
			);

			console.log(chalk.red(message));
			return;
		}

		try {
			userCredentialsCache.set("username", obj.data.username);
			userCredentialsCache.set("password", obj.data.password);
			if (email) {
				userCredentialsCache.set("email", obj.data.email);
			}

			console.log(
				chalk.green.bold("Success!"),
				chalk.green(`You are logged in as ${obj.data.username}`)
			);
		} catch (e) {
			console.log(chalk.red("Sorry, something went wrong... "));
		}
	});
}

export function transactions(username) {
	numTransactions
		? console.log(`Getting last ${numTransactions} transactions...`)
		: console.log(`Getting all transactions...`);
}

export function who() {
	console.log( userCredentialsCache.get("username"));
}
