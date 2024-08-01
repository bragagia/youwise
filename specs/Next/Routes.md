# Summary

- Schematics -> https://miro.com/app/board/uXjVKthThfM=/

# /auth/new-access-token

This route is used to generate a new access token using a refresh token.

# /auth/validate-oauth

This route handles OAuth validation (currently supports Google OAuth) and creates or retrieves a user based on the provided OAuth token.

# /resources/get - PRIVATE

This route retrieves a specific resource owned by the authenticated user, including its associated cards and memories.

# /memories/new - PRIVATE

Create new memories, all data is provided by the front end

# /memories/update - PRIVATE

Partial update of memories, all data is provided by the front end

# /user/create - PRIVATE

This route creates a new resource for the authenticated user based on the content of a web page. It also generates questions and flashcards using GPT models.

Steps:

- Fetches the content of a specified web page.
- Parses the content to extract an article. (Currently only in plain text)
- Creates a new resource in the database with the article content.
- Use GPT to generate a list of questions
- Use GPT to generate flashcards based on the questions
- Creates the generated flashcards in the database
- **[TODO]**: Should create associated memories for the user

# /user/get-recommendations - PRIVATE

This route retrieves a list of resources owned by the authenticated user. The response groups the resources into different categories (currently all resources are listed under the library category).
