import Europa from "node-europa";

const parser = new Europa.default({
  absolute: true,
  baseUri: "https://help.viasat.com",
  eol: "\r\n",
  inline: true,
});

export function htmlToMd(doc: string) {
  return parser.convert(doc);
}
