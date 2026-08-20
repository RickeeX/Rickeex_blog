# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Next.js 16, React 19, and Tailwind CSS. It uses Velite for content management (MDX files in `data/blog/` are processed into JSON data in `.velite/`). The project was originally based on the tailwind-nextjs-starter-blog template.

## Common Commands

```bash
# Development - runs Velite in watch mode + Next.js dev server
npm run dev

# Production build
npm run build

# Preview the static export
npx serve out

# Lint and auto-fix
npm run lint

# Bundle analysis
npm run analyze
```

This project uses Node.js 24 and npm. The package lock is the dependency source of truth.

## Architecture

### Content Management

- Blog posts are written in MDX format in `data/blog/`
- Velite processes MDX files and generates typed JSON in `.velite/`
- Content types are generated in `.velite/index.d.ts`
- Server-side content access is centralized in `lib/content.server.ts`
- Client-safe types and pure helpers live in `lib/content.ts`

### Key Directories

- `app/` - Next.js App Router pages (page.tsx, layout.tsx, API routes)
- `components/` - Shared React components
- `layouts/` - Blog post layouts (PostLayout, PostBanner, PostSimple, ListLayoutWithTags)
- `lib/` - Utility functions (content.ts for blog data access)
- `data/` - Site configuration and MDX content

### Configuration

- `data/siteMetadata.ts` - Site title, description, theme, and search configuration
- `next.config.js` - Static export, image, SVG, and base-path configuration

### Post Frontmatter

```yaml
title, date, tags, lastmod, draft, summary, images, authors, layout, canonicalUrl
```

### Available Post Layouts

- `PostLayout` - Default 2-column layout with meta and author info
- `PostSimple` - Simplified version
- `PostBanner` - Features a banner image
