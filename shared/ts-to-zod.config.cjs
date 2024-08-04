const files = [
  "void.tsx",
  "auth.tsx",
  "revisionStats.tsx",
  "memory.tsx",
  "card.tsx",
  "ressource.tsx",
  "user.tsx",
];

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
