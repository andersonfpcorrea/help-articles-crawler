import { saveArticles } from "./lib/crawler/saveArticles.js";

const articlePages = [
  ["billing", "https://help.viasat.com/s/topic/0TO3k000000cWTlGAM/billing"],
  [
    "account-admin",
    "https://help.viasat.com/s/topic/0TO3k000001roeLGAQ/account-admin",
  ],
  [
    "technical-troubleshooting",
    "https://help.viasat.com/s/topic/0TO3k000001roeoGAA/technical-troubleshooting",
  ],
  ["products", "https://help.viasat.com/s/topic/0TO3k000001roepGAA/products"],
  [
    "speeds-and-connectivity",
    "https://help.viasat.com/s/topic/0TO3k000002BhGRGA0/speeds-and-connectivity",
  ],
  [
    "new-customers",
    "https://help.viasat.com/s/topic/0TO3k000002BhGWGA0/new-customers",
  ],
];

async function main() {
  for (const [categoryName, categoryLink] of articlePages) {
    await saveArticles(categoryName, categoryLink);
  }
}

main();
