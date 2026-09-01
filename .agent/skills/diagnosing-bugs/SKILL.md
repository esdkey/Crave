---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
---

# Diagnosing Bugs

A structured diagnosis loop for hard bugs and performance regressions.

## Phase 1: Build a feedback loop

Before doing anything else, build a way to reproduce the bug reliably and quickly. A feedback loop is a reproducible trigger + observable signal. Without one, you're guessing.

### Ways to construct one, in roughly this order

1. **Run existing tests** — does the bug already manifest in a failing test?
2. **Write a failing test** — if not, write the smallest test that exposes the bug
3. **Add a script** — a short `node script.js` or `curl` that triggers and observes
4. **Use the running app** — only if the above are impractical; note that this is the slowest loop

### Tighten the loop

A good loop is fast (under 5 seconds), focused (tests one thing), and deterministic (same result every run). If the loop is slow, it's worth spending time making it faster before diagnosing.

### Non-deterministic bugs

If the bug is flaky (sometimes passes, sometimes fails), you need to make it deterministic before diagnosing. Strategies:
- Run in a loop until it fails
- Remove timing dependencies (use fake timers)
- Isolate shared state (databases, file system, environment)

### Completion criterion: a tight loop that goes red

Don't move to Phase 2 until you have a reproducible, fast, deterministic trigger.

## Phase 2: Reproduce + minimise

With the loop in hand, strip everything away until you have the smallest possible reproduction. Remove:
- External dependencies (mock them)
- Unrelated code paths
- Configuration that doesn't affect the behavior

A minimal reproduction is 10× easier to reason about.

## Phase 3: Hypothesise

With a minimal reproduction, form hypotheses about the cause. Good hypotheses are:
- **Specific** — "the bug occurs when the array is empty" not "something is wrong with arrays"
- **Falsifiable** — you can design an experiment to test them
- **Prioritised** — start with the most likely cause

Write down your hypotheses before testing any of them. This prevents confirmation bias.

## Phase 4: Instrument

Add observability to test your hypotheses:
- `console.log` at key points
- Debugger breakpoints
- Assertions at boundaries

Test one hypothesis at a time. When a hypothesis is disproved, update your model.

## Phase 5: Fix + regression test

Once you've identified the root cause:
1. Fix it
2. Verify the loop goes green
3. Add a regression test that would have caught this bug
4. Remove any diagnostic instrumentation you added

## Phase 6: Cleanup

Review any workarounds or temporary hacks added while diagnosing. Remove them if they're no longer needed.
