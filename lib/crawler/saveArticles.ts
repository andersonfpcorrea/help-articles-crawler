import puppeteer from "puppeteer";

export async function saveArticles(categoryName: string, categoryLink: string) {
  console.log({ categoryName, categoryLink });
  const browser = await puppeteer.launch({ headless: false, timeout: 0 });
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

  const articleLinks = [];
  for (let i = 0; i < articleList.children.length; i++) {
    const articleLink = await page.evaluate(() => {
      return document.querySelector<HTMLAnchorElement>("a.article-link")?.href;
    });
    articleLinks.push(articleLink);
  }

  console.log(articleLinks);

  await browser.close();
}
