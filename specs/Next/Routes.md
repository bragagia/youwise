# Summary

- Schematics -> https://miro.com/app/board/uXjVKthThfM=/

# Auth

### /auth/new-access-token

This route is used to generate a new access token using a refresh token.

### /auth/validate-oauth

This route handles OAuth validation (currently supports Google OAuth) and creates or retrieves a user based on the provided OAuth token.

# Resources

### /resources/get - PRIVATE

This route retrieves a specific resource owned by the authenticated user, including its associated cards and memories.

### /resources/create - PRIVATE

This route creates a new resource based on the content of a web page. It also generates questions and flashcards using GPT models.

Steps:

- Fetches the content of a specified web page.
- Parses the content to extract an article. (Currently only in plain text)
- Creates a new resource in the database with the article content.
- Use GPT to generate a list of questions
- Use GPT to generate flashcards based on the questions
- Creates the generated flashcards in the database
- **[TODO]**: Should create associated memories for the user

# Memories

### /memories/new - PRIVATE

Create new memories, all data is provided by the front end

### /memories/update - PRIVATE

Partial update of memories, all data is provided by the front end

# Daily revisions

### /daily-revisions/generate - PRIVATE

Creates a daily revision. The response is the list of memories and cards to be reviewed on that day.

The route fetch the memories to be revised for the next four days, randomize the order, and return a quarter of them. This allow to smooth the number of memories to review each day.

# User

### /user/get-recommendations - PRIVATE

This route retrieves a list of resources owned by the authenticated user. The response groups the resources into different categories (currently all resources are listed under the library category).
