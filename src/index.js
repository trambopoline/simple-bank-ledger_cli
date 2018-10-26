import program from "commander";
import {
	register,
	login,
	who,
	logout,
	deposit,
	withdraw,
	transactions,
	getBalance
} from "./controllers/commands";

program.version(process.env.VERSION).description(process.env.DESCRIPTION);

// error on unknown commands
program.on("command:*", function() {
	console.error(
		`Invalid command: ${program.args.join(" ")}\nSee --help for a list of available commands.`
	);
	process.exit(1);
});

program
	.command("register <username> <password> [email]")
	.alias("rg")
	.description("Register a new username and password")
	.action(register);

program
	.command("login <username> <password>")
	.alias("li")
	.description("Log in using your username and password")
	.action(login);

program
	.command("who")
	.alias("w")
	.description("Show the currently logged in user, if any")
	.action(who);

program
	.command("logout")
	.alias("lo")
	.description("Log out of the current session")
	.action(logout);

program
	.command("deposit <amount>")
	.alias("dep")
	.description("Deposit money into your account")
	.action(deposit);

program
	.command("withdraw <amount>")
	.alias("wd")
	.description("Withdraw money from your account")
	.action(withdraw);

program
	.command("history [number-of-transactions]")
	.alias("his")
	.description("See your transaction history")
	.action(transactions);

program
	.command("balance")
	.alias("bal")
	.description("Check your account balance")
	.action(getBalance);

// Display help if no arguments supplied
if (!process.argv.slice(2).length) {
	program.help();
}

program.parse(process.argv);
