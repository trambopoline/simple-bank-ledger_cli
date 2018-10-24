import program from "commander";
import {register, who} from "./controllers/commands";

program.version(process.env.VERSION).description(process.env.DESCRIPTION);

program
	.command("register <username> <password> [email]")
	.alias("r")
	.description("Register a new username and password")
	.action(register);

program
	.command("login <username> <password>")
	.alias("li")
	.description("Log in using your username and password")
	.action(username => console.log(`Logging in as ${username}...`));

program
	.command("who")
	.alias("w")
	.description("Show the currently logged in user, if any")
	.action(who);

program
	.command("logout")
	.alias("lo")
	.description("Log out of the current session")
	.action(() => console.log(`Logging out...`));

program
	.command("deposit <amount>")
	.alias("d")
	.description("Deposit money into your account")
	.action(amount => console.log(`Depositing ${amount}...`));

program
	.command("withdraw <amount>")
	.alias("w")
	.description("Withdraw money from your account")
	.action(amount => console.log(`Withdrawing ${amount}...`));

program
	.command("transactions [number-of-transactions]")
	.alias("t")
	.description("See a list of your transactions")
	.action(numTransactions => {
		numTransactions
			? console.log(`Getting last ${numTransactions} transactions...`)
			: console.log(`Getting all transactions...`);
	});

// Display help if no arguments supplied
if (!process.argv.slice(2).length) {
	program.help();
}

program.parse(process.argv);
