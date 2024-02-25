import puppeteer from "puppeteer";
import fs from "fs";
import { join } from "path";

const baseUrl = "https://help.viasat.com";

const articlePages = [
  ["billing", "https://help.viasat.com/s/topic/0TO3k000000cWTlGAM"],
  ["account-admin", "https://help.viasat.com/s/topic/0TO3k000001roeLGAQ"],
  [
    "technical-troubleshooting",
    "https://help.viasat.com/s/topic/0TO3k000001roeoGAA",
  ],
  ["products", "https://help.viasat.com/s/topic/0TO3k000001roepGAA"],
  [
    "speeds-and-connectivity",
    "https://help.viasat.com/s/topic/0TO3k000002BhGRGA0",
  ],
  ["new-customers", "https://help.viasat.com/s/topic/0TO3k000002BhGWGA0"],
];

async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl);

  const articleListSelector =
    "body > div.peak-theme.cPeak_Uber_Theme > section > div > div.slds-col--padded.contentRegion.comm-layout-column > div > div:nth-child(2) > div > div > ul";

  const articleLinks = await page.evaluate(
    (selector, url) => {
      const ulElement = document.querySelector(selector);
      const listItems = ulElement.children;
      const links = [];
      for (let i = 0; i < listItems.length; i++) {
        const articleId = listItems[i].querySelector("a").dataset.id;
        links.push(`${url}/s/topic/${articleId}`);
      }
      return links;
    },
    articleListSelector,
    baseUrl
  );

  fs.writeFileSync(
    join(import.meta.dirname, "links.txt"),
    articleLinks.join("\n")
  );

  await browser.close();
}

main();
