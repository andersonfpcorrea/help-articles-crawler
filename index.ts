import { saveArticles } from "./lib/crawler/saveArticles.js";

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
  articlePages.forEach(([categoryName, categoryLink]) => {
    saveArticles(categoryName, categoryLink);
  });
}

main();
