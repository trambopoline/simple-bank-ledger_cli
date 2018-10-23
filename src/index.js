import commander from "commander";

commander.version(process.env.VERSION).description(process.env.DESCRIPTION);

commander
	.command("login <username> <password>")
	.alias("li")
	.description("Log in using your username and password")
	.action(username => console.log(`Logging in as ${username}...`));

commander
	.command("register <username> <password> [email]")
	.alias("r")
	.description("Register a new username and password")
	.action(username => console.log(`Registering as ${username}...`));

commander
	.command("logout")
	.alias("lo")
	.description("Log out of the current session")
	.action(() => console.log(`Logging out...`));

commander
	.command("deposit <amount>")
	.alias("d")
	.description("Deposit money into your account")
	.action(amount => console.log(`Depositing ${amount}...`));

commander
	.command("withdraw <amount>")
	.alias("w")
	.description("Withdraw money from your account")
	.action(amount => console.log(`Withdrawing ${amount}...`));

commander
	.command("transactions [number-of-transactions]")
	.alias("t")
	.description("See a list of your transactions")
	.action(numTransactions => {
		numTransactions ? console.log(`Getting last ${numTransactions} transactions...`) : console.log(`Getting all transactions...`);
	});

commander.parse(process.argv);
