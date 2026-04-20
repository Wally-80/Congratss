# Congratss Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Component-First
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained... -->
Every feature in Congratss must be built as a reusable, modular component. UI must be separate from logic. Components must be self-contained and easily testable.

### II. Test-First (NON-NEGOTIABLE)
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->
TDD is encouraged where applicable, especially for core logic and shared UI components.

### III. Scalable Data Management
<!-- Example: Focus areas requiring integration tests -->
All backend logic, services, and queries must ensure scalable and secure user data isolation via Firebase Authentication.

### IV. Responsive & Accessible UI
<!-- Example: Start simple, YAGNI principles -->
UI must look great on both mobile and desktop (mobile-first approach). Proper ARIA labels and semantic HTML must be used.

## Security Requirements

All Firebase read/writes must be protected via firestore security rules based on authentication and tenant isolation. 

## Development Workflow

Code review requirements: 
1. Unit test passes.
2. E2E check (if applicable).
3. Follow the Checklist and Project Plan.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
