---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Scan the codebase for structural improvement opportunities, present options, then work through the chosen one systematically.

## Process

### 1. Explore

Read the codebase with fresh eyes. Look for:

- **Repeated logic** — same pattern appearing in 3+ places
- **Shallow modules** — files that export one tiny thing and are only used once
- **Deep coupling** — modules that import from many other modules
- **Missing abstractions** — code that would be cleaner with a shared interface
- **Boundary violations** — UI code in business logic, DB queries in components
- **Inconsistent patterns** — same problem solved three different ways

Go wide first. Read file trees, imports, and key files. Don't fix anything yet.

### 2. Present candidates as an HTML report

After exploring, produce an HTML report with:

- The top 3–5 architectural improvement candidates
- For each: what the problem is, what the opportunity is, and estimated effort (S/M/L)
- A recommendation on which to tackle first

Write the HTML to a temp file and open it so the user can see it clearly.

### 3. Grilling loop

Once the user chooses a candidate:

1. **Clarify scope** — what's in and out of the change
2. **Propose the structure** — show the new design before writing code
3. **Get confirmation** — ask if the proposed structure looks right
4. **Implement** — make the change in small committed steps
5. **Verify** — run tests and type checks after each step

Don't start implementing until the structure is agreed. Structural changes are hard to reverse.

## Principles

- **Prefer deepening over widening** — make existing modules handle more, don't add new modules
- **Colocate related things** — if two files always change together, they may belong together
- **Name the seam** — a good abstraction has a name that makes the code read like prose
- **Don't refactor untested code** — if there are no tests at the seam, write them first
