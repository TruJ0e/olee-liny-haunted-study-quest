# Requirements Document — Moonlight Points & Costume Unlocks

## Introduction

Completed tasks earn moonlight points. A moon-phase ring shows this week's progress. Lifetime
points unlock costume pieces that dress Olee (balloon) and Liny (ball). Points are never spent
and never taken away for missed days.

## Requirements

### Requirement 1 — Points accrual

**User Story:** As a kid, I want points for each finished task, so that I can see my effort add
up.

#### Acceptance Criteria

1. WHEN a task is checked THE SYSTEM SHALL add 10 moonlight points.
2. WHEN a task is un-checked on the same day THE SYSTEM SHALL remove those 10 points (undo only).
3. WHEN all of today's tasks are completed THE SYSTEM SHALL add a 20-point "full moon" bonus
   once per day, removed only if a task is un-checked that same day.
4. THE SYSTEM SHALL NOT deduct points for missed days, ever.
5. THE SYSTEM SHALL show lifetime points and this week's points.

### Requirement 2 — Moon-phase week ring

**User Story:** As a kid, I want a moon that fills up over the week, so that I can see how my
week is going.

#### Acceptance Criteria

1. THE SYSTEM SHALL define a week as Monday–Sunday in local time.
2. THE SYSTEM SHALL render a ring of 7 segments, one per day, each showing a moon phase
   (new, crescent, half, gibbous, full) from that day's completion ratio.
3. THE SYSTEM SHALL show future days as faint outlines and past days without study as a calm
   new moon (no red, no X).
4. WHEN a new week starts THE SYSTEM SHALL start a fresh ring and weekly points; lifetime points
   are unaffected.

### Requirement 3 — Costume unlocks

**User Story:** As a kid, I want to unlock costume pieces for Olee and Liny, so that I have
something fun to work toward.

#### Acceptance Criteria

1. WHEN lifetime points reach a threshold in the unlock table THE SYSTEM SHALL unlock that piece.
2. WHEN a piece unlocks THE SYSTEM SHALL show a celebration with the piece and its character.
3. THE SYSTEM SHALL let the child equip or unequip any unlocked piece on its character, one
   piece per slot (head, body) per character.
4. THE SYSTEM SHALL show locked pieces as silhouettes with "N more points" — never as a loss.
5. THE SYSTEM SHALL keep unlocks permanently.

### Unlock table

| Points | Character | Slot | Piece | id |
| --- | --- | --- | --- | --- |
| 50 | Olee | head | Pumpkin cap | `olee-pumpkin-cap` |
| 100 | Liny | head | Tiny witch hat | `liny-witch-hat` |
| 200 | Olee | body | Star cape | `olee-star-cape` |
| 300 | Liny | body | Friendly ghost sheet | `liny-ghost-sheet` |
| 450 | Olee | head | Bat-wing headband | `olee-bat-headband` |
| 600 | Liny | head | Candy-corn beanie | `liny-candy-corn-beanie` |
| 800 | Olee | body | Moonlight wizard robe | `olee-wizard-robe` |
| 1000 | Liny | body | Jack-o'-lantern suit | `liny-pumpkin-suit` |
