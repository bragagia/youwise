const files = [
  "auth.tsx",
  "revisionStats.tsx",
  "memory.tsx",
  "card.tsx",
  "ressource.tsx",
  "user.tsx",
  "dailyRevisions.tsx",
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
  customJSDocFormatTypes: {
    date: {
      regex: "^\\d{4}-\\d{2}-\\d{2}$",
      errorMessage: "Must be in YYYY-MM-DD format.",
    },
  },
}));
