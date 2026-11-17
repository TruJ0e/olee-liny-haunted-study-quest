# Requirements Document — Parent View

## Introduction

A read-only glance for a parent or caregiver on the same device. No settings, no PII, and no
data leaves the device.

## Requirements

### Requirement 1 — Open the glance

**User Story:** As a parent, I want to peek at progress quickly, so that I can encourage my kid.

#### Acceptance Criteria

1. THE SYSTEM SHALL provide a "Grown-ups" button that opens the parent view in place.
2. THE SYSTEM SHALL NOT require a password, account, or email.
3. WHEN the parent view is closed THE SYSTEM SHALL return to the kid view unchanged.

### Requirement 2 — Read-only progress

**User Story:** As a parent, I want a summary of study habits, so that I know how things are
going.

#### Acceptance Criteria

1. THE SYSTEM SHALL show today's tasks done/total, study days this week and in the last 30
   days, current lantern glow, lifetime moonlight points, and costumes unlocked.
2. THE SYSTEM SHALL show a 14-day mini calendar of study days using calm visuals only.
3. THE SYSTEM SHALL NOT offer any control that edits, deletes, or exports the child's data.
4. THE SYSTEM SHALL follow the same no-shame language rules as the kid view.

### Requirement 3 — Privacy

**User Story:** As a parent, I want assurance that nothing is collected, so that I can trust the
app.

#### Acceptance Criteria

1. THE SYSTEM SHALL show a short privacy note: "Everything stays on this device. No accounts,
   no ads, no tracking."
2. THE SYSTEM SHALL NOT display or store any personal information.
3. THE SYSTEM SHALL make no network requests from the parent view.
