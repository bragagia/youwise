# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouWise is an app to read book summaries and memorize them using spaced repetition learning.
The app uses the FSRS algorithm for intelligent flashcard scheduling.

It's built as a monorepo with:

- API (Fastify/tRPC): Backend for both web and mobile
- mobile (React Native/Expo): The end-user mobile app
- web (Next.js): Web app to make the app content accessible and SEO-friendly. Also contains the admin dashboard.

## Essential Commands

### Development Setup

```bash
# Install all dependencies
yarn install

# Start all development servers
cd api && yarn dev          # API server with auto-migrations
cd mobile && yarn start     # Expo development server
cd web && yarn dev          # Next.js with Turbopack
```

### API Development (`/api/`)

```bash
yarn dev          # Start with migrations and codegen
yarn codegen      # Generate database types from schema
yarn migrate-all  # Run database migrations
```

### Mobile Development (`/mobile/`)

```bash
yarn start        # Expo development server
yarn android      # Run on Android device/emulator
yarn ios          # Run on iOS device/simulator
yarn lint         # ESLint
```

### Web Development (`/web/`)

```bash
yarn dev          # Next.js development server
yarn build        # Production build
yarn lint         # Next.js linting
```

## Architecture

### Monorepo Structure

- `api/` - Fastify server with tRPC, Kysely (PostgreSQL), JWT auth
- `mobile/` - React Native/Expo app with Expo Router, NativeWind
- `web/` - Next.js 15 app with Tailwind CSS v4

### Key Technologies

- **Type Safety**: tRPC provides end-to-end TypeScript safety between client/server
- **Database**: PostgreSQL with Kysely query builder and automatic type generation
- **Authentication**: Multi-provider OAuth (Google/Apple) with JWT tokens
- **Learning Algorithm**: FSRS (ts-fsrs) for spaced repetition scheduling
- **Mobile**: Expo development builds for custom native code

### Authentication Flow

- OAuth providers store tokens in Expo Secure Store
- JWT access tokens with automatic refresh via React Query
- Apple Auth requires physical device (doesn't work in iOS Simulator)

### Database Patterns

- Domain-driven structure: `auth/`, `users/`, `aiGeneration/`
- Memory parameters track learning progress (Easy/Normal/Hard/Harder)
- FSRS algorithm manages card scheduling and review intervals

## Development Notes

### Mobile Builds

- Use EAS development builds for testing native features
- Apple Authentication requires physical iOS device
- Build locally with `eas build --local` if needed

### Database Changes

- Always run `yarn codegen` after schema changes
- Migrations run automatically in development via `yarn dev`
- Database types are generated in `api/generated/`

### VS Code Integration

- Terminal splits configured for parallel development
- Auto-formatting and import organization on save
- Build directories excluded from search

### Environment Setup

- API requires `.env.local` with database credentials and OpenAI API key
- Mobile OAuth requires proper app configuration in Google/Apple consoles
- Web runs standalone without external dependencies
