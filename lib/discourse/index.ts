const API_KEY = "";
const API_USERNAME = "";
const BASE_URL = "https://forum.test.viasat.com";

interface NewTopic {
  title: string;
  raw: string;
  category: number;
  created_at?: string;
}

export function createNewTopic({ title, raw, category }: NewTopic) {
  fetch(`${BASE_URL}/posts.json`, {
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
    }),
    method: "POST",
  });
}
