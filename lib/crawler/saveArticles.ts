import puppeteer from "puppeteer";

// const baseUrl = "https://help.viasat.com";

export async function saveArticles(categoryName: string, categoryLink: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(categoryLink);

  const loadMoreButton = await page.evaluate(() => {
    const btns = document.querySelectorAll("button");
    return Array.from(btns).find((btn) => btn.innerText === "Load more");
  });
  loadMoreButton?.click();

  const articleList = await page.evaluate(() => {
    return document.querySelector("ul.article-list");
  });

  if (articleList === null) return;

  await browser.close();
}
