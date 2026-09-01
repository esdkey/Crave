---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Guidance for distinctive, intentional visual design. This skill helps produce UI that feels considered and original rather than assembled from defaults.

## Ground it in the subject

Before making visual decisions, understand what the interface is for and who it serves. The aesthetic should emerge from that — not from generic "modern" patterns.

Ask: what mood, weight, and pace fits the content? A legal document and a children's app both use typography, but nothing else should be the same.

## Design principles

**Hierarchy first.** Every screen needs a clear reading order. Size, weight, color, and space all contribute. Establish one primary thing and make everything else secondary to it.

**Restraint over decoration.** One strong typographic choice outperforms three mediocre ones. Use color sparingly: a single accent color applied consistently is more powerful than a palette of five.

**Whitespace is structure.** Margins and padding aren't empty — they separate, group, and pace. Tighter spacing implies relation; looser spacing implies independence.

**Consistency in the details.** Border radii, spacing increments, shadow depths, and transition durations should all follow a system. Inconsistency in small things signals carelessness.

## Process: brainstorm, explore, plan, critique, build, critique again

1. **Brainstorm** — Gather references, moods, precedents. What aesthetic territory are we in? What should this feel like in use?
2. **Explore** — Try directions. Don't commit early. Make several different approaches to the same component or layout.
3. **Plan** — Choose direction. Specify the type system (sizes, weights, line heights), color palette (background, text, accent, error), spacing scale, and border/shadow vocabulary.
4. **Critique before building** — Before writing code, ask: does this look considered or assembled? Is there one clear visual idea?
5. **Build** — Implement cleanly. Prefer CSS custom properties for the design system values. Keep component styles colocated.
6. **Critique again** — Step back. Is the hierarchy clear? Is anything competing that shouldn't be? Does the spacing feel consistent?

## Restraint and self-critique

Defaults are invisible traps. Blue links, gray placeholder text, the same border-radius everywhere — they read as unconsidered.

When reviewing your own output, ask:
- Would a designer notice this was built without a design?
- Is there one coherent visual idea, or several competing ones?
- Does the scale (type, spacing) feel systematic or arbitrary?
- What would I cut to make this stronger?

## More on writing in design

Typography is the primary carrier of voice. Choose typefaces with intention:
- Serifs feel established, authoritative, literary
- Geometric sans-serifs feel modern, neutral, technical
- Humanist sans-serifs feel approachable, warm
- Display faces carry personality — use sparingly

Set type at sizes that reflect importance, not convention. Body text at 16px is a floor, not a target. Headings should be large enough to anchor the layout.

Line length matters: 60–75 characters per line for body text. Narrower for captions; wider starts to feel like a document.
