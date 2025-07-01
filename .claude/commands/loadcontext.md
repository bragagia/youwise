Run the following commands to gather context about the current state of the repository:

```bash
find . -type f -not -path "*/node_modules/*" -not -path "./api/build/*" -not -path "./.git/*" -not -path "./mobile/ios/*" -not -path "./mobile/.expo/*" -not -path "./web/.next/*"

git status
```
