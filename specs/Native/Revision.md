# Revision

The Revision screen implement a spaced repetition system for efficient learning.

- Uses a card interface

  - Depending on card type, it can either be displayed as:
    - a simple question and answer card
      - Users can swipe right for correct answers and left for incorrect answers
    - a multiple-choice question
      - For multiple-choice questions, users tap the correct answer
      - If the user taps on the wrong answer, the right answer is highlighted and a button appears to let the user learn the correct answer before skipping.
    - an occlusion card # TODO
  - Cards are presented one at a time, with the next card preloaded for smooth transitions
  - The background color changes dynamically based on the current card resource tint color

- The cards used for the session are selected based on cards memories due dates

  - Every cards due today are selected
  - Today's card are a quarter of the cards due in the next 4 days, this allow to smooth the number of cards to review each day

- The algorithm used is a custom local algorithm, not to be confused with the long term retention algorithm used to decide the next card review. This algorithm take the list of card that should be reviewed today and helps the user learn them
  - New cards are introduced gradually to prevent overwhelming the user
  - Each new or forgotten card must be answer correctly two times before being considered learned
- Displays a progress bar at the top of the screen
  - The progress always go forward.
  - If the user answer wrongly, the progress doesn't move
  - To give the illusion of always moving forward, the progress is divided in by the number of cards, and each card has a logarithmic progress toward 1 until it is learned.
- Pause button to exit the revision session at any time
- At the end of a revision session, displays comprehensive statistics
  - Shows number of new cards learned, cards revised, and average time per card
  - Go home button to close the session
  - TODO: Should allow to continue to a next session to create addictive behavior

Design choices:

- Haptic feedback is provided for user actions to give better pleasure
