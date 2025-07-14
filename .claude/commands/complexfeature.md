## Working with Complex Feature Requests

When the user requests multiple interconnected changes or complex features, follow this systematic approach:

### 1. Deep Analysis First

- Use the Task tool to thoroughly analyze the current codebase structure
- Understand existing patterns, component hierarchies, and data flows
- Identify all files and components that need modification
- Document the current state comprehensively

### 2. Create Detailed Implementation Plan

- Break down the request into specific, actionable tasks
- Organize tasks by priority (high/medium/low) and logical dependencies
- Create a TodoWrite with all planned tasks
- Present the plan to the user for discussion and approval

### 3. Plan Structure Template

For each major change, document:

- **Current Issue**: What's wrong or missing
- **Solution**: How to fix it
- **Key Files**: Which files need modification
- **Implementation Details**: Specific technical approaches

### 4. User Collaboration

- Present the plan clearly and ask for feedback
- Clarify requirements and get specific answers on:
  - UI/UX preferences (layout, interaction patterns)
  - Technical approaches (component structure, data flow)
  - Scope and priorities
- Get explicit approval before starting implementation

### 5. Execution Phase

- Work through todos systematically, marking in_progress and completed
- Follow the existing codebase patterns and conventions
- Test incrementally and fix linting issues as you go
- Update documentation and changelog when complete

### 6. Documentation Updates

- Update CLAUDE.md with any new patterns or guidelines discovered
- Document architectural decisions and rationale
- Keep the changelog updated with meaningful entries

This approach ensures thorough understanding, clear communication, and systematic execution of complex features while maintaining code quality and user satisfaction.
