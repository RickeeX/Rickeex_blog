# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Next.js 16, React 19, and Tailwind CSS. It uses Velite for content management (MDX files in `data/blog/` are processed into JSON data in `.velite/`). The project was originally based on the tailwind-nextjs-starter-blog template.

## Common Commands

```bash
# Development - runs Velite in watch mode + Next.js dev server
yarn dev

# Production build
yarn build

# Start production server
yarn serve

# Lint and auto-fix
yarn lint

# Bundle analysis
yarn analyze
```

Note: This project uses Yarn (v3.6.1), not npm.

## Architecture

### Content Management

- Blog posts are written in MDX format in `data/blog/`
- Velite processes MDX files and generates typed JSON in `.velite/`
- Content types are defined in `.velite/index.js` and `.velite/index.d.ts`
- Access content via `lib/content.ts` which imports from `.velite/blogs.json`

### Key Directories

- `app/` - Next.js App Router pages (page.tsx, layout.tsx, API routes)
- `components/` - React components (Header, Footer, Comments, etc.)
- `layouts/` - Blog post layouts (PostLayout, PostBanner, PostSimple, ListLayoutWithTags)
- `lib/` - Utility functions (content.ts for blog data access)
- `data/` - Site configuration (siteMetadata.js, headerNavLinks.ts, projectsData.ts)

### Configuration

- `data/siteMetadata.js` - Site title, description, analytics (Umami), comments (Giscus), newsletter (Buttondown), search (Kbar)
- `next.config.js` - Next.js configuration including security headers and CSP

### Post Frontmatter

```yaml
title, date, tags, lastmod, draft, summary, images, authors, layout, canonicalUrl
```

### Available Post Layouts

- `PostLayout` - Default 2-column layout with meta and author info
- `PostSimple` - Simplified version
- `PostBanner` - Features a banner image
