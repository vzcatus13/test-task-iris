import { GoogleTab } from "@/scraper/google/accounts";

const GOOGLE_MAIL_URL = "https://mail.google.com";

export async function getUnreadCount(tab: GoogleTab) {
  console.log("Fetching unread count..."); // Demo

  const { page } = tab;

  await page.goto(GOOGLE_MAIL_URL);
  await page.waitForSelector('div[role="tabpanel"]');

  const mailCount = await page.evaluate(() => {
    const unreadCountElement = document.querySelector(
      '[data-tooltip="Inbox"] div.bsU'
    );
    return Number(unreadCountElement?.textContent || 0);
  });

  return mailCount;
}
