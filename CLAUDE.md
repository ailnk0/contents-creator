# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start development server at http://localhost:3000
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: Tailwind CSS v4 with shadcn/ui (new-york style)
- **Package Manager**: pnpm

## Project Structure

- `app/` - Next.js App Router pages (each folder with `page.tsx` is a route)
- `lib/utils.ts` - Shared utilities including the `cn()` function for Tailwind class merging
- `app/globals.css` - Global styles with CSS variables for theming (light/dark mode via oklch colors)
- `components.json` - shadcn/ui configuration

## Code Conventions

- Path alias `@/*` maps to project root
- Import order enforced by Prettier (React, Next, third-party, then local imports with blank lines between groups)
- Uses Geist font family via `next/font`
- Dark mode uses `.dark` class variant
