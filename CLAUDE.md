# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Instructions to contribute this repository

- The project is always running in the background, never try to build it.
- Rely on the linters command to see errors. Always check the linter feedbacks at the end of working on a user request. If the request take you a long time, periodically check the linter to see if you introduced new issues. Always fix all issues.
- Before adding new code, always do a deep search in the codebase to check if there is similar code already implemented in the project. This will also help you to keep the code consistent with the existing codebase
- When the user asks for something, always think about his request and if relevant, asks question to clarify the request. This will help both you and the user to understand the requirements better
- If you are not sure about something, ask for clarification
- The user love receiving honest feedbacks, being asked questions, being challenged, and being given new ideas about his requests or the project. Be fully honest and proactive in your communication.

## Project Overview

YouWise is an app to never forget a book again. It allows users to efficiently read compressed books (= efficient summaries) and memorize the content using spaced repetition learning on quizz generated from the content.

The app uses the FSRS algorithm for intelligent flashcard scheduling based on science.

## Architecture

It's built as a monorepo with, in the root directory:

- mobile
  - The end-user mobile app, can only be used while logged in
- web
  - Used for two products:
    - Web app to make the app content accessible and SEO-friendly. The goal is to gather users from there and redirect them to the mobile app to see the full content.
      - Can be used logged out
      - Allow account creation, but only to access the mobile app
    - Admin dashboard to create app content and manage users
- api
  - Backend used by both web and mobile

## User flows

### As a potential user (web app - logged out and unregistered) [TODO: this is not implemented yet]

- Discover the app through SEO, social media, ads, or word of mouth
- Be explained YouWise value prop
- Browse ressources publicly
- Browse resources publicly at `/resources/[id]`
- Call-to-action to create account and download mobile app

### As a registered user in the mobile app (primary experience)

- If unregistered
  - be presented a sign up with Google OAuth or Apple Sign-In
- If registered
  - be presented a sign in with Google OAuth or Apple Sign-In

The rest of the user flow will be about the authenticated experience.

**Main mobile flow**:

- Homepage
  - See progress charts to motivate user to learn more and be consistent with its memorization
  - List of in progress resources (that are partially read) [TODO: need a reading state in db]
  - List of the full youwise library
    - Short description must be visible for each resource
    - Can click on a resource to see its details
      - See resource page, featuring description, cover, and list of sections
      - Button "next page" to start reading the resource
        - Reading section by section
        - At the end of the book, button to add the book to the memorization library
          - Possibility to choose the section to memorize
            - Each section should have a dense list of the flashcards from that section
  - Have a prominent "Start daily ReWise" action button
    - User see one card at a time, swipe left to fail, right to succeed.
    - New cards are displayed in quizz mode (using fake answers)
      - User must succeed at least 2 times in a row to have the card considered memorized
    - Card already known use a random variant every time
    - At the end of the session, user see its progress and can choose to continue or stop
  - Account management
    - Profile page with name, email, and profile picture
    - Settings page to manage account preferences
    - Sign out button

### As an admin (web dashboard)

- Access the admin dashboard at `/` [TODO: should be /admin and protected by a static key]
  - See users list with details
- See resources list with details
  - Create new resources
    - Upload EPUB file
    - AI processing to extract content and generate summaries
    - Each resource fields and sections content is editable
  - See resources list
    - See sections list
      - Can click on a section to:
        - See section content
        - See list of section's cards

## Tech stack

- Yarn: package manager used in all subprojects, in monorepo mode
- TypeScript: Used in all parts of the project
- PostgreSQL: Database used by the API
- tRPC: Provides end-to-end type safety between api and mobile/web clients
  - @trpc/tanstack-react-query: Used in both web and mobile to access the tRPC API
- zod: Used everywhere for schema validation and type inference. We only use the import from "zod/v4"

- mobile
  - Expo + React Native
  - Nativewind: Provide tailwind-like styling for React Native, exact same API as Tailwind CSS
  - ts-fsrs: FSRS algorithm
  - icons are a mix of lucide-icons and copies of apple system icons
- web
  - Next.js
    - Only use server actions, never build a route inside next code
    - actions should be collocated to the page they are used in, in an actions.tsx file.
      - If some actions are common to multiple page, make an actions folder
  - Tailwind
  - Kysely to access the database
  - Shadcn/ui: Component library built on Radix UI.
    - All the admin dashboard is built using raw shadcn/ui components
  - epubjs: Used to parse epub
  - AI:
    - OpenAI and Gemini: Used to generate book summaries and quizzes. Only Gemini is used now but OpenAI is still available for future use
    - Langfuse: LLM observability and tracing
  - react-markdown
  - lucide-icons: Icon library
- api: Backend used by both web and mobile

  - Fastify
  - tRPC: Provides a type-safe API layer for both web and mobile clients
  - Kysely
  - ts-fsrs: FSRS algorithm

- Authentication system:
  - Multi-provider OAuth (Google/Apple) with JWT tokens
    - User is given two tokens:
      - Refresh token: Long-lived JWT used to refresh access token
      - Access token: Short-lived JWT used for API requests
  - Expo Secure Store for secure token storage on mobile
  - Token is refreshed automatically via React Query if a request fails with a 401 Unauthorized error

## Tools

- mobile
  - Runs on http://localhost:8081/ for web version
  - `yarn lint`
- web
  - Runs on http://localhost:3000/
  - `yarn lint`
- api
  - Runs on http://localhost:3001/
  - `yarn codegen`: Generate database types from schema
  - `yarn migrate-all`: Run all database migrations

## Tables

Exact database can be found in `api/database.d.ts`, this is a summary:

id are uuid, each table contains an updated_at and created_at timestamp

- users → id, email, given_name, family_name (nullable), google_uid (nullable), apple_uid (nullable)
- resources → id, name, description (markdown), cover (image url), tint (color value)
- resource_sections → id, resource_id, title, content (markdown), more_content (markdown, nullable), position (ordering)
- cards → id, resource_section_id, variants (JSON array of CardVariant)
  - exact definitions: `web/types/cards.ts` and `mobile/lib/types/card.tsx`
  - CardVariant type definitions:
    - ClassicCardVariant → type (only "classic" now), question: string|string[], answer: string|string[], fakeAnswers?: string[]
  - note: variants is an array of CardVariant objects. Each card can have multiple variants for bidirectional learning (e.g., "What's the capital of France?" + "Of which country is Paris the capital?"). fakeAnswers enables multiple-choice quiz mode
  - note: cards are statically generated from book summaries, and are not associated to a user until they are memorized
- memories → id, card_id, owner_user_id
- memory_params → memory_id,
  - note: Contains FSRS algorithm parameters for spaced repetition learning. Each memory has different due dates based on difficulty level chosen by user
- daily_revisions → id, owner_user_id, date
  - note: Tracks daily review sessions for users
- memories_on_daily_revisions → memory_id, daily_revisions_id
  - note: Junction table linking memories to daily revision sessions

## Development guidelines

- AI output should always be validated through zod schemas
