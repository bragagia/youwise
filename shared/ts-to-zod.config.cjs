const fs = require("fs");

const directoryPath = "./api";

// Use fs.readdirSync to read the contents of the directory synchronously
const fileList = fs.readdirSync(directoryPath);

const files = fileList.filter(
  (file) => !file.includes("-schema.tsx") && !file.includes("index.tsx")
);

/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = files.map((file) => ({
  name: file.replace(".tsx", ""),
  input: `api/${file}`,
  output: `api/${file.replace(".tsx", "-schema.tsx")}`,
}));
