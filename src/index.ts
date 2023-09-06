import "module-alias/register";

import { Command } from "commander";
import { getUnreadCount } from "@/scraper/google/mail";
import { loginAndCreateTab, logout } from "@/scraper/google/accounts";

const program = new Command();

program.version("1.0.0");

program
  .command("get-unread-count")
  .description("Get unread count of specified Google Mail account")
  .requiredOption("-l, --login <login>", "Login to Google Mail")
  .requiredOption("-p, --password <password>", "Password to Google Mail")
  .action(async (options: { login: string; password: string }) => {
    const tab = await loginAndCreateTab(options.login, options.password);
    const unreadCount = await getUnreadCount(tab);

    console.log(`Unread count of ${options.login} is ${unreadCount}.`);

    await tab.page.close();
    await logout(options.login);
  });

program.option("-v, --verbose", "verbose logging");
process.on("unhandledRejection", (err: Error) => {
  console.error(`Something went wrong: ${err.message}.`);
  const debug = program.opts().verbose;
  if (debug) {
    console.error(err.stack);
  } else {
    console.error("To see error stack use --verbose option.");
  }
  process.exit(1);
});

async function main() {
  await program.parseAsync();
}

main();
