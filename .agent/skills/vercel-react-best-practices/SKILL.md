---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

React and Next.js performance optimization guidelines from Vercel Engineering.

## When to Apply

Use these guidelines when:
- Writing or reviewing React components or Next.js pages
- Optimizing data fetching patterns
- Reducing bundle size
- Improving rendering performance
- Refactoring existing React/Next.js code

## Rule Categories by Priority

| Priority | Category | Impact |
|---|---|---|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size Optimization | CRITICAL |
| 3 | Server-Side Performance | HIGH |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |
| 6 | Rendering Performance | MEDIUM |
| 7 | JavaScript Performance | LOW-MEDIUM |
| 8 | Advanced Patterns | LOW |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)
- Fetch data in parallel using `Promise.all` where possible
- Avoid sequential `await` chains for independent data
- Use React Suspense boundaries to stream content
- Prefer Server Components for data fetching to avoid client waterfalls

### 2. Bundle Size Optimization (CRITICAL)
- Use dynamic imports (`next/dynamic`) for heavy components
- Avoid importing entire libraries — use named imports
- Analyze bundle with `@next/bundle-analyzer`
- Keep client components lean; push logic to Server Components

### 3. Server-Side Performance (HIGH)
- Prefer React Server Components (RSC) for non-interactive UI
- Use `generateStaticParams` for static paths
- Leverage Next.js caching (`fetch` cache, `revalidate`)
- Keep Server Components free of client-only APIs

### 4. Client-Side Data Fetching (MEDIUM-HIGH)
- Use SWR or React Query for client-side data
- Implement optimistic updates for better UX
- Deduplicate requests at the component level

### 5. Re-render Optimization (MEDIUM)
- Use `React.memo` for expensive pure components
- Stabilize callback refs with `useCallback`
- Memoize expensive computations with `useMemo`
- Split context to avoid unnecessary re-renders

### 6. Rendering Performance (MEDIUM)
- Virtualize long lists with `react-window` or `react-virtual`
- Avoid layout thrashing — batch DOM reads and writes
- Use CSS transitions instead of JS animations where possible

## How to Use

Reference these rules during code review and implementation. Prioritize CRITICAL rules first, then HIGH, then resolve MEDIUM only when performance is measurably impacted.
