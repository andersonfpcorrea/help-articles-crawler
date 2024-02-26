import Europa from "node-europa";
import { writeFileSync } from "fs";

const parser = new Europa.default({
  absolute: true,
  baseUri: "https://help.viasat.com",
  eol: "\r\n",
  inline: true,
});

export function htmlToMd(doc: string | undefined) {
  try {
    return parser.convert(doc);
  } catch (err) {
    const error = err as Error;
    writeFileSync(
      `./err/${Date.now()}.txt`,
      error.stack + "\n" + error.message + "\n" + doc
    );
    return null;
  }
}
