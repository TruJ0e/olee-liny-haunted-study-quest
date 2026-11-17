# Requirements Document — Daily Checklist

## Introduction

The daily checklist is the heart of the app: a short list of study tasks for today that a child
checks off, guided by Olee (balloon) and Liny (ball). It ships with four default tasks and lets
the child add their own. A new list starts each local calendar day. All data stays in
`localStorage` (`hsaq-state-v1`). See steering: `design-system.md`, `kid-safety.md`.

## Requirements

### Requirement 1 — Default tasks

**User Story:** As a kid, I want a ready-made list of today's study tasks, so that I know what
to do without setting anything up.

#### Acceptance Criteria

1. WHEN the app opens for the first time THE SYSTEM SHALL show four default tasks: Reading,
   Math, Homework, Practice, each unchecked.
2. THE SYSTEM SHALL render each task as a toggle at least 56 × 56 px with a visible text label.
3. WHEN no tasks exist for today THE SYSTEM SHALL create today's list from the task template.

### Requirement 2 — Add your own

**User Story:** As a kid, I want to add my own task, so that the list fits what I'm working on.

#### Acceptance Criteria

1. WHEN the child enters a task label (1–40 characters after trimming) and confirms THE SYSTEM
   SHALL add it to today's list and to the task template for future days.
2. IF the label is empty or only whitespace THEN THE SYSTEM SHALL not add a task and SHALL show
   a gentle hint ("Type a task name first!").
3. THE SYSTEM SHALL cap the template at 12 tasks and SHALL explain the cap kindly when reached.
4. WHEN the child removes a custom task THE SYSTEM SHALL remove it from the template; default
   tasks may be hidden but not deleted.
5. THE SYSTEM SHALL store task labels only on the device and SHALL NOT send them anywhere.

### Requirement 3 — Check off

**User Story:** As a kid, I want to tap a task to check it off and see Olee and Liny cheer, so
that finishing feels good.

#### Acceptance Criteria

1. WHEN the child taps an unchecked task THE SYSTEM SHALL mark it done, persist the change, and
   show a short cheer from Olee or Liny.
2. WHEN the child taps a checked task THE SYSTEM SHALL un-check it (mistakes are fine) and
   persist the change, with no negative message.
3. WHEN a task changes state THE SYSTEM SHALL notify the points and streak features
   (DOM event `hsaq:task-changed`).
4. WHEN every task for today is done THE SYSTEM SHALL show an "All done for today!" celebration.

### Requirement 4 — Day rollover

**User Story:** As a kid, I want a fresh list each day, so that today starts clean.

#### Acceptance Criteria

1. THE SYSTEM SHALL key each day by the device's local date (`YYYY-MM-DD`).
2. WHEN the app opens or regains focus on a new local date THE SYSTEM SHALL archive the previous
   day's results into history and create a fresh unchecked list from the template.
3. WHEN the app stays open across midnight THE SYSTEM SHALL roll over within one minute.
4. THE SYSTEM SHALL keep at most 60 days of history and drop older entries.
5. IF the device clock moves backwards THEN THE SYSTEM SHALL not erase or duplicate history.
