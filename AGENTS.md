# AGENTS.md

> Project Rules & AI Collaboration Guide
>
> This file defines **hard constraints, coding standards, and collaboration rules** for this project.
> Any AI assistant (including Codex) **must strictly follow this file** when generating or modifying code.

---

## 1. Project Overview

**Project:** Personal Task Manager
**Platform:** Expo (React Native)
**Language:** TypeScript (strict)
**Navigation:** Expo Router

This project is a **technical assessment**. Code quality, correctness, and explainability are more important than feature quantity.

All code must be understandable, maintainable, and defensible in a technical interview.

---

## 2. Non‑Negotiable Rules (Hard Constraints)

These rules are absolute. Do **NOT** violate them.

### 2.1 Language & Types

* ✅ TypeScript only
* ❌ `any` is **NOT allowed**
* ❌ `as any`, `unknown` abuse, or unsafe type assertions
* ✅ Prefer union types, enums, and explicit interfaces
* ✅ All functions must have clear input/output types

If a type is unclear, **define a new type** instead of weakening the type system.

---

### 2.2 State Management

* ✅ React Hooks only (`useState`, `useReducer`, `useMemo`, `useCallback`)
* ❌ Redux, MobX, Zustand, or any external state library
* ❌ Global mutable state

Local, predictable state is preferred.

---

### 2.3 Navigation

* ✅ Must use **Expo Router**
* ❌ React Navigation directly
* Routes must be file‑based and explicit

---

### 2.4 Dependencies

* ❌ Do NOT add new dependencies unless explicitly approved
* ❌ No UI libraries unless already included
* ✅ Prefer native React Native / Expo APIs

If a new dependency seems necessary, **STOP and explain why before adding it**.

---

## 3. Data Model (Canonical Source)

All task-related logic must conform to the following model.

```ts
export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;            // unique identifier (uuid or timestamp string)
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;     // Date.now()
  updatedAt: number;
};
```

Rules:

* `id` must be stable and unique
* `status` must never be boolean
* timestamps are numbers, not `Date` objects

---

## 4. Project Structure Rules

Keep the structure simple and predictable.

Recommended structure:

```
app/                # Expo Router routes
components/         # Reusable UI components
features/           # Feature-based logic (task-related)
types/              # Shared TypeScript types
utils/              # Pure helper functions
```

Rules:

* ❌ No deeply nested folders without justification
* ❌ No giant components (>300 lines)
* ✅ Prefer small, focused components

---

## 5. Code Style & Readability

* Prefer **clarity over cleverness**
* Functions should do **one thing**
* Avoid deeply nested conditionals
* Use early returns where appropriate

Naming:

* `handleX` → event handlers
* `onX` → props callbacks
* `useX` → custom hooks

Comments:

* ❌ No obvious comments (`// increment i`)
* ✅ Explain *why*, not *what*, when necessary

---

## 6. Git & Pull Request Rules

### 6.1 Branching

* `main` must always be runnable
* Feature branches only:

```
feature/<short-description>
```

Examples:

* `feature/add-task`
* `feature/task-details`

---

### 6.2 Pull Requests

Each PR must:

* Address **one issue only**
* Be small and reviewable
* Include a clear description:

  * What was changed
  * Why it was changed
  * How to verify

PR Checklist (must be satisfied):

* [ ] App runs with `expo start`
* [ ] No TypeScript errors
* [ ] No `any`
* [ ] Feature manually tested

---

### 6.3 Code Review Requirement

* At least **one PR must be reviewed by another contributor**
* You must also **review at least one PR** from someone else
* Review comments should be technical (types, logic, structure)

Evidence of review is required.

---

## 7. AI Usage Rules (Codex / ChatGPT)

AI is allowed, but:

* ❗ You are responsible for **every line of code**
* ❗ You must be able to explain any AI-generated code

AI must:

* Make **small, incremental changes**
* Respect all rules in this file
* Provide verification steps
* Explain critical logic when asked

Recommended workflow for AI:

1. Ask for a **plan first** (no code)
2. Review the plan
3. Allow implementation
4. Verify locally
5. Do a short self‑review / explanation

---

## 8. Verification & Quality Bar

Before merging any PR, you should be able to:

* Explain the full data flow
* Justify type choices
* Answer "what happens if…" edge cases
* Identify where bugs would most likely occur

If you cannot explain it, it does not belong in `main`.

---

## 9. Guiding Principle

> **This project is evaluated like a real production codebase written by a junior engineer.**

Stability, clarity, and ownership matter more than speed.

---

End of AGENTS.md
