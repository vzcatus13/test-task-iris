import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const GOOGLE_ACCOUNTS_URL = "https://accounts.google.com";

type GoogleSession = {
  browser: Browser;
};

export type GoogleTab = {
  page: Page;
};

const sessions: Map<string, GoogleSession> = new Map();

export async function loginAndCreateTab(
  login: string,
  password: string
): Promise<GoogleTab> {
  console.log(`Logging as ${login}...`); // Demo

  const sessionKey = `${login}`;

  if (sessions.has(sessionKey)) {
    const session = sessions.get(sessionKey) as GoogleSession;
    return { page: await session.browser.newPage() };
  }

  const browser = await puppeteer.launch({ headless: "new" });

  const session: GoogleSession = {
    browser,
  };

  sessions.set(sessionKey, session);

  const page = await browser.newPage();
  await page.goto(GOOGLE_ACCOUNTS_URL);

  await page.waitForSelector('input[type="email"]', { visible: true });
  await page.type('input[type="email"]', login);
  await page.click('div[id="identifierNext"]');
  await page.waitForResponse((res) =>
    res.url().startsWith(GOOGLE_ACCOUNTS_URL)
  );

  const loginInvalid = await page.evaluate(() => {
    const input = document.querySelector('input[type="email"]');
    return input?.getAttribute("aria-invalid") === "true";
  });

  if (loginInvalid) {
    throw new Error(`Login (${login}) doesn't exist`);
  }

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', password);
  await page.click('div[id="passwordNext"]');
  await page.waitForResponse((res) =>
    res.url().startsWith(GOOGLE_ACCOUNTS_URL)
  );

  let passwordInvalid;
  try {
    passwordInvalid = await page.evaluate(() => {
      const input = document.querySelector('input[type="password"]');
      return input?.getAttribute("aria-invalid") === "true";
    });
  } catch (e) {
    await page.waitForNavigation();
  }

  if (passwordInvalid) {
    throw new Error(`Password is invalid (for ${login})`);
  }

  await page.close();

  console.log(`Logged as ${login}.`); // Demo

  return { page: await browser.newPage() };
}

export async function logout(login: string) {
  const sessionKey = `${login}`;
  const session = sessions.get(sessionKey);

  await session?.browser.close();
}

async function cleanup() {
  for (let session of sessions) {
    const [key, { browser }] = session;

    if (browser.process() !== null) {
      browser.process()?.kill("SIGINT");
    }

    sessions.delete(key);
  }
}

process.on("exit", cleanup);
