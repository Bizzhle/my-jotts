---
name: feature-implementation-planning
description: 'Plan feature implementation without writing code. Use when you need a concrete implementation roadmap with scope, architecture impact, folders/files to create or update, packages to install, risks, and ordered execution steps.'
argument-hint: 'Describe the feature, constraints, and target area of the codebase.'
user-invocable: true
disable-model-invocation: false
---

# Feature Implementation Planning

Create a detailed, execution-ready implementation plan for a feature. This skill is planning-only.

## Hard Rules
- Do not write or suggest production code snippets.
- Do not edit files as part of this skill.
- Focus on planning outputs only: steps, file/folder plan, dependency plan, validation plan.
- Be explicit about assumptions and unknowns.

## Planning Modes
- Quick mode: produce a lean plan for low-complexity features.
- Full mode: produce the complete sectioned plan for medium/high complexity features.
- Choose mode based on scope, risk, and number of affected layers. If unclear, ask which mode the user wants.

## When to Use
- You need to break down a new feature into implementation tasks.
- You want a file-by-file and folder-by-folder change plan before coding.
- You need to identify package additions and justify each dependency.
- You want a checklist that can be executed by another engineer.

## Inputs To Collect
1. Feature goal and user-facing outcome.
2. In-scope and out-of-scope boundaries.
3. Affected layers (frontend, backend, data, infra, docs, tests).
4. Constraints: timeline, compatibility, performance, security, compliance.
5. Existing patterns or modules that must be reused.
6. Definition of done and acceptance criteria.

If any critical input is missing, ask focused follow-up questions before finalizing the plan.

## Planning Procedure
1. Restate objective and constraints.
2. Map impact areas:
   - Components/services/modules likely affected.
   - Data model and API contract changes (if any).
   - Runtime/config/environment implications.
3. Produce implementation slices:
   - Break work into vertical increments that deliver testable value.
   - Note dependencies and preferred sequence.
4. Produce folder and file plan:
   - Files/folders to create.
   - Existing files expected to change.
   - Purpose of each file in one line.
5. Produce package plan:
   - Packages to install or upgrade.
   - Why each is needed.
   - Risk notes (bundle size, maintenance, security, lock-in).
   - Prefer a balanced approach: suggest packages when they clearly improve delivery speed, reliability, or maintainability.
6. Produce verification plan:
   - Tests to add/update by layer.
   - Manual QA checks and edge cases.
   - Rollback and observability checks.
7. Produce delivery checklist:
   - Ordered task list with prerequisites.
   - Completion criteria per task.

## Required Output Format
Use this section order for full mode:
1. Objective and Scope
2. Assumptions and Open Questions
3. Architecture and Impact Analysis
4. Implementation Slices
5. Folder and File Plan
6. Dependency and Package Plan
7. Validation and Testing Plan
8. Execution Checklist
9. Risks and Mitigations

Quick mode must include:
1. Objective and Scope
2. Key Impact Areas
3. File/Folder Plan
4. Package Plan
5. Execution Checklist
6. Top Risks

## Quality Bar
A good plan must be:
- Specific: names concrete modules/files, not generic areas.
- Sequenced: tasks are ordered with dependencies called out.
- Testable: each slice has clear validation criteria.
- Minimal: avoids unnecessary dependencies or file churn.
- Safe: highlights migration, compatibility, and rollback concerns.

## Decision Rules
- If complexity is high, split into phases and milestones.
- If requirements are unstable, propose a thin first slice and feature flags.
- If dependency value is unclear, default to no new package and note alternatives.
- If API/data contracts change, include backward-compatibility steps.

## Completion Checks
Before finalizing, confirm the plan includes:
- At least one deliverable slice with measurable outcome.
- A complete file/folder change map.
- A justified package install list (or explicit no-new-packages decision).
- Test and QA coverage for core flow and edge cases.
- Identified risks with mitigation or fallback.
- No effort estimate requirements unless the user explicitly asks for estimates.
