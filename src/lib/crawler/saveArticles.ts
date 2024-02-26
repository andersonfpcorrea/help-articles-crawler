import puppeteer from "puppeteer";
import { htmlToMd } from "../parser/htmlToMd.js";
import { writeFileSync } from "fs";

export async function saveArticles(categoryName: string, categoryLink: string) {
  console.log({ categoryName, categoryLink });
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 0,
  });
  const page = await browser.newPage();
  await page.goto(categoryLink);

  await page.waitForSelector("button");

  const loadMoreButton = await page.evaluate(() => {
    const btns = document.querySelectorAll("button");
    return Array.from(btns).find((btn) => btn.innerText === "Load more");
  });
  loadMoreButton?.click();

  await page.waitForSelector("ul.article-list");

  const articleLinks = await page.evaluate(() => {
    const hrefs = [];
    const anchors =
      document.querySelectorAll<HTMLAnchorElement>("a.article-link");
    for (const anchor of anchors) {
      hrefs.push(anchor.href);
    }
    return hrefs;
  });

  for (const link of articleLinks) {
    await page.goto(link);
    await page.waitForSelector(
      "div.slds-form-element__control.slds-grid.itemBody > span > div"
    );
    await page.waitForSelector("article.summary");
    await page.waitForSelector("article.content");
    await page.waitForSelector("h2.article-head");

    const article = await page.evaluate(() => {
      const html = document.querySelector(
        "div.slds-form-element__control.slds-grid.itemBody > span > div"
      )?.outerHTML;
      const title =
        document.querySelector<HTMLHeadingElement>(
          "h2.article-head"
        )?.innerText;
      return { html, title };
    });

    if (!article.html || !article.title) return;

    const md = htmlToMd(article.html);
    console.log({ md });
    if (md === null) continue;

    writeFileSync(
      `./articles/${categoryName}/${article.title
        .split(" ")
        .join("-")
        .replace(/\?/g, "")}.md`,
      md,
      { encoding: "utf-8" }
    );
  }

  await browser.close();
}
