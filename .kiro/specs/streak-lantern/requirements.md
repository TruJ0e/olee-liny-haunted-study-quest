# Requirements Document — Streak Lantern

## Introduction

A jack-o'-lantern shows study consistency. Each study day adds glow; a missed day dims it. The
lantern NEVER breaks, smashes, or resets with negative fanfare (see steering `kid-safety.md`).

## Requirements

### Requirement 1 — Study day definition

**User Story:** As a kid, I want my lantern to know when I studied, so that my effort counts.

#### Acceptance Criteria

1. THE SYSTEM SHALL count a local date as a *study day* WHEN at least one task was completed on
   that date.
2. WHEN the first task of today is completed THE SYSTEM SHALL add today's glow immediately.
3. WHEN all of today's tasks are un-checked THE SYSTEM SHALL remove today's glow without any
   negative message.

### Requirement 2 — Light and dim

**User Story:** As a kid, I want the lantern to glow brighter as I keep studying, so that I can
see my progress.

#### Acceptance Criteria

1. THE SYSTEM SHALL keep a glow level from 0 to 7.
2. WHEN a study day is recorded THE SYSTEM SHALL raise glow by 1 (max 7).
3. WHEN a calendar day passes with no study THE SYSTEM SHALL lower glow by 1 per missed day,
   never below 1 once the lantern has ever been lit.
4. THE SYSTEM SHALL render brighter glow with more `--pumpkin-orange` light and dimmer glow with
   `--pumpkin-orange-dim`, always keeping the carved face smiling.

### Requirement 3 — No-break rule

**User Story:** As a parent, I want missed days handled gently, so that my kid isn't shamed.

#### Acceptance Criteria

1. THE SYSTEM SHALL NOT display a broken, smashed, smoking, or sad lantern.
2. THE SYSTEM SHALL NOT use words such as "lost", "broke", "failed", "missed" or "reset" in
   lantern copy.
3. WHEN the child returns after days without study THE SYSTEM SHALL greet them with a
   welcome-back line (e.g. "Welcome back! Let's add some glow.").
4. THE SYSTEM SHALL also show "Study days this month" as a count that only ever goes up within
   the month.
