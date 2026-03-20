# SpendWise AI — Architecture & Contribution Reference

This document covers the architecture, design decisions, and development workflow
introduced by the SpendWise AI contribution to the Expense Tracker project.
Intended for contributors and maintainers reviewing or extending this work.

---

## Contribution Summary

A complete frontend elevation delivered across seven pull requests against the
upstream Expense Tracker repository.

| PR | Scope |
|---|---|
| PR #0 | Prerequisite fixes — P0 auth bug, environment split, broken test assertion |
| PR #1 | Global design system — CSS custom property token foundation |
| PR #2 | Domain models — typed interfaces for all API contracts |
| PR #3 | Login component — redesign, validators, error handling |
| PR #4 | Home component — view states, summary bar, typed service methods |
| PR #5 | ExpenseList component — all fields rendered, typed Input |
| PR #6 | AddExpense component — validated form, category config, typed payload |
| PR #7 | Register flow — new component, route, service method, documentation |

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Angular 20.0.3 — standalone components, no NgModule |
| Language | TypeScript — strict typing, zero `any` in production code |
| Styling | CSS custom properties — no third-party UI library |
| Auth | JWT via HttpClient functional interceptor |
| Forms | Angular Reactive Forms with validators and inline error display |
| Build | `@angular/build` (esbuild-based) |
| Backend | Django REST Framework — out of scope for this contribution |

---

## Prerequisites

- Node.js 18 or later
- Angular CLI 20
```bash
npm install -g @angular/cli
```

---

## Getting Started
```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`. The backend must be running at
`http://127.0.0.1:8000` by default. See environment configuration below.

---

## Environment Configuration

Environment files live in `src/environments/`.

| File | Purpose |
|---|---|
| `environment.ts` | Development — `production: false`, localhost API URL |
| `environment.prod.ts` | Production — update `apiUrl` before deploying |

The build system swaps files via `fileReplacements` in `angular.json`.
```bash
# Development
ng serve

# Production build
ng build --configuration production
```

---

## Project Structure
```
src/
  app/
    config/
      expense-categories.ts     # Single source of truth for expense categories
    guards/
      auth-guard.ts             # Functional route guard — JWT presence check
    interceptors/
      auth-interceptor.ts       # Bearer token injection + 401 refresh retry
    models/
      auth.model.ts             # LoginPayload, TokenResponse, RegisterPayload, RegisterResponse
      expense.model.ts          # Expense, CreateExpensePayload, ExpenseSummary
    login/
      login.ts / html / css     # Sign in — smart component
      login-service.ts          # POST /api/token/, POST /api/register/
    register/
      register.ts / html / css  # New user registration — smart component
    home/
      home.ts / html / css      # Expense list with summary bar and view states
      home-service.ts           # GET + POST /api/expenses/, GET /api/expenses/summary/
      expense-list/             # Dumb component — single expense card
      add-expense/              # Add new expense form — smart component
  environments/
    environment.ts
    environment.prod.ts
  styles.css                    # Global design tokens — no component styles here
```

---

## Key Design Decisions

### Design System Tokens

All visual properties — color, spacing, typography, border radius, shadow,
transitions — are defined as CSS custom properties in `styles.css`. No component
contains hardcoded values. To change the visual system globally, change the tokens.
Components reference variables exclusively, for example `var(--color-accent-default)`.

### Typed End-to-End

Every HTTP call, service method, component `@Input`, and form value is typed against
interfaces in `src/app/models/`. `any` is a defect, not a shortcut. The interface
is defined before implementation — it is the contract between layers.

### Smart / Dumb Component Boundary

Smart components (`Login`, `Register`, `Home`, `AddExpense`) own state and service
calls. Dumb components (`ExpenseList`) receive `@Input` and emit `@Output` only.
No business logic lives in templates. This boundary is explicit by design, not
by accident.

### Single Source of Truth for Categories

`EXPENSE_CATEGORIES` in `src/app/config/expense-categories.ts` is the only place
category values are defined. The `AddExpense` component imports and binds to this
constant. Adding or removing a category requires changing one file — nothing else.

### Error Handling

Every Observable subscription carries an error handler. Every async operation has
a user-visible error state. No silent failures. The `Home` component uses a
`ViewState` type (`loading | loaded | empty | error`) to make all states explicit
and template-driven.

### Auth Flow

JWT stored in `localStorage`. Access token attached to all outgoing requests via
a functional interceptor. On 401, the interceptor attempts a token refresh and
retries the original request. On refresh failure, storage is cleared and the user
is redirected to `/login`. Token storage responsibility belongs to `LoginService`,
not to the component.

---

## API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/token/` | Obtain access and refresh tokens |
| POST | `/api/token/refresh` | Refresh access token |
| POST | `/api/register/` | Create new user account |
| GET | `/api/expenses/?ordering=-created_at` | Fetch expense list |
| POST | `/api/expenses/` | Create new expense |
| GET | `/api/expenses/summary/` | Fetch monthly spend summary |

---

## Known Technical Debt

| Item | Location | Action Required |
|---|---|---|
| `.vscode/` tracked in git history | repo root | Maintainer runs `git rm -r --cached .vscode/` locally |
| `production: true` with localhost `apiUrl` | `environment.prod.ts` | Update `apiUrl` to production backend URL before deploying |
| `ExpenserSerializer` class name typo | backend `expenses/serializer.py` | Rename to `ExpenseSerializer` in a backend PR |
| `HttpClient` injected inside auth interceptor | `auth-interceptor.ts` | Refactor to dedicated `AuthService` to eliminate circular dependency risk |
| `DEBUG = False` with `ALLOWED_HOSTS = ['*']` | backend `settings.py` | Restrict `ALLOWED_HOSTS` to known domains before production deployment |

---

## Contribution Workflow

One concern per PR. No PR mixes refactoring with feature work. Architecture
confirmed before implementation begins. Each PR is self-contained, passing,
and reviewable without context from other open PRs. Code reviewed against
actual file contents — no assumptions about existing implementations.
