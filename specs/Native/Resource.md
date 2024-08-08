# Resource

Shows individual resource content

- Displays resource title, content, and external link (if available)
- Content in displayed as plain text for now
- If resource isn't memorized, display the ReWise button
  - On click, start a ReWise session with the resource cards
    - When the session starts, add the cards to the user's memories
    - After each memorized card, update the card in the backend
  - Display a percentage of the cards that are learned
- If resource is memorized, display the Learned text with a checkmark
  - **[TODO]**: On click, allow to remove from memorized
