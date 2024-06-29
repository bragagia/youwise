# Users

- Email
- Password

Can own one or more courses, resources groups, resources, highlights, questions, and memories.

# AI Usage

- Reference to owner user
- Date
- Model used
- Prompt tokens
- Response tokens

# Courses

- Reference to owner user
- Name
- Description (optional)

Contains one or more resources groups.

# Resource groups

- Reference to owner user
- Reference to course (optional) (if it has a parent course)
- Name
- Description (optional)

Contains one or more resources

# Resources

- Reference to owner user
- Reference to resource group (optional) (if it has a parent resource group)
- Name
- Description (optional)
- Resource type (e.g. book chapter, article, video, question folder, etc.)
- Original URL (optional) (e.g. URL to original webpage/yt video)
- Resource content: One of the following (if none, it is a question folder without an actual resource):
  - File ID + Chapter number (optional)
  - Content

Contains one or more highlights, questions, and memories.

# Highlights

- Reference to resource
- Is AI created ?
- Highlighted text
- Note (optional)
- Context (optional) (In case the highlight is not self-sufficient and needs more context to be understood)

# Questions

- Reference to owner user
- Reference to resource
- Reference to highlight (optional)
- Question (markdown)
- Answer (markdown)

In case it was AI created, it will have a reference to the highlight it was created from.

# Memories

- Reference to owner user
- Reference to question
- Memory Status (learning, reviewing, relearning)
- Interval time (optional)
- Ease Factor
- Step Number
