import { readdir, readFile } from "fs";

const API_KEY = "";
const API_USERNAME = "";
const BASE_URL = "";

const categories = {
  "Account and billing": 16,
  "New customers": 32,
  Products: 33,
  "Video Quality": 17,
  "Data Usage": 16,
  Connectivity: 19,
} as const;

const categoriesMap: Record<string, number> = {
  "account-admin": categories["Account and billing"],
  billing: categories["Account and billing"],
  "new-customers": categories["New customers"],
  products: categories.Products,
};

const speedsAndConnectivityFilesMap = {
  "Troubleshooting-Video-Buffering-or-Quality-Issues":
    categories["Video Quality"],
  rest: categories["Data Usage"],
};

interface NewTopic {
  title: string;
  raw: string;
  category: number;
  created_at?: string;
}

const dirs = [
  "./articles/account-admin",
  "./articles/billing",
  "./articles/new-customers",
  "./articles/products",
  "./articles/speeds-and-connectivity",
  "./articles/technical-troubleshooting",
];

export async function createNewTopic({ title, raw, category }: NewTopic) {
  return fetch(`${BASE_URL}/posts.json`, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_KEY,
      "Api-Username": API_USERNAME,
    },
    body: JSON.stringify({
      title,
      raw,
      category,
      created_at: new Date().toISOString(),
      archetype: "regular",
      tags: ["article"],
      unlist_topic: false,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status === 200) {
      console.log(`[Status]: ${res.status}; [Topic-Title]: ${title}`);
    } else console.log(res.status);
  });
}

function chooseCategory(dir: string, file: string) {
  let category: number;
  const folder = dir.split("/").at(-1);
  if (
    folder &&
    ["account-admin", "billing", "new-customers", "products"].includes(folder)
  ) {
    category = categoriesMap[folder];
    return category;
  }
  if (folder === "speeds-and-connectivity") {
    if (file === "Troubleshooting-Video-Buffering-or-Quality-Issues.md") {
      category =
        speedsAndConnectivityFilesMap[
          "Troubleshooting-Video-Buffering-or-Quality-Issues"
        ];
      return category;
    } else {
      return (category = speedsAndConnectivityFilesMap.rest);
    }
  }
  if (folder === "technical-troubleshooting") {
    if (
      file === "How-to-self-install-the-Viasat-Wi-Fi-Modem.md" ||
      file === "Which-video-games-should-I-play-on-Viasat-Internet.md"
    ) {
      return (category = categories["New customers"]);
    } else {
      return (category = categories.Connectivity);
    }
  }
}

async function waitSec(sec: number) {
  return new Promise((res) => {
    setTimeout(res, sec * 1000);
  });
}

async function main() {
  let count = 0;
  let miss = 0;
  for (const dir of dirs) {
    readdir(dir, async (err, files) => {
      if (err) {
        console.error(err);
        console.log({ dirError: true });
        return;
      }

      for (const file of files) {
        readFile(`${dir}/${file}`, "utf-8", async (err, content) => {
          if (err) {
            console.log({ fileError: true });
            console.error("Error reading file:", err);
            return;
          }

          const chosenCategory = chooseCategory(dir, file);
          if (!chosenCategory) {
            console.log("Missed article");
            console.log({ chosenCategory });
            console.log(`Missed ${++miss} topics`);
            return;
          }

          console.log(`Created ${++count} new topics`);
          await createNewTopic({
            title: file.replace(/\-/g, " ").replace(".md", ""),
            raw: content,
            category: chosenCategory,
          });
          console.log(`Created ${++count} new topics`);
          await waitSec(5);
        });
      }
    });
  }
}

main();
