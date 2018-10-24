import program from "commander";
import { register, login, who, logout, deposit, withdraw, transactions } from "./controllers/commands";

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
	.alias("dp")
	.description("Deposit money into your account")
	.action(deposit);

program
	.command("withdraw <amount>")
	.alias("wd")
	.description("Withdraw money from your account")
	.action(withdraw);

program
	.command("transactions [number-of-transactions]")
	.alias("t")
	.description("See a list of your transactions")
	.action(transactions);

// Display help if no arguments supplied
if (!process.argv.slice(2).length) {
	program.help();
}

program.parse(process.argv);
