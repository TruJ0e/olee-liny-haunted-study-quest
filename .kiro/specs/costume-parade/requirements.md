# Requirements Document — Costume Parade

## Introduction

A celebration view where Olee and Liny show off every costume piece the child has unlocked.
Pure presentation: it reads existing progress and never changes it. This is the feature the
demo video ends on, so it should feel like a tiny reward ceremony, not a settings screen.

## Requirements

### Requirement 1 — Open the parade

**User Story:** As a child, I want to see my costumes on Olee and Liny, so that my work
feels celebrated.

#### Acceptance Criteria

1. THE SYSTEM SHALL provide a "Costume Parade" button in the costume shelf section.
2. WHEN the parade is opened THE SYSTEM SHALL show Olee and Liny large, centered, on a
   moonlight-cream stage.
3. WHEN the parade is closed THE SYSTEM SHALL return to the main view with state unchanged.

### Requirement 2 — Cycle the unlocked pieces

**User Story:** As a child, I want each costume I earned to get its moment, so that every
unlock feels special.

#### Acceptance Criteria

1. THE SYSTEM SHALL display one unlocked costume piece at a time on its character (Olee
   pieces on Olee, Liny pieces on Liny), auto-advancing every 2.5 seconds and looping.
2. THE SYSTEM SHALL show the current piece's name and the character it belongs to in
   friendly text (for example, "Olee's Pumpkin Cap").
3. THE SYSTEM SHALL pause the cycling while the child taps and holds the stage, and resume
   on release.
4. IF no costume is unlocked yet THEN THE SYSTEM SHALL show Olee and Liny plainly with the
   line "Your first costume is on its way — keep going!" and SHALL NOT show any locked
   piece as a failure.

### Requirement 3 — Locked pieces stay gentle

**User Story:** As a child, I want to peek at what's coming, so that I have something to
aim for without feeling behind.

#### Acceptance Criteria

1. THE SYSTEM SHALL show locked pieces below the stage as calm silhouettes with the
   moonlight points still needed ("25 more moonlight").
2. THE SYSTEM SHALL NOT use the words "locked", "failed", or any red or alarming styling
   for unearned pieces.

### Requirement 4 — Safety and motion

**User Story:** As a parent, I want the parade to respect the same kid-safety rules as the
rest of the app.

#### Acceptance Criteria

1. THE SYSTEM SHALL make no network requests and SHALL NOT write to saved state.
2. WHEN the device prefers reduced motion THE SYSTEM SHALL render a static grid of the
   unlocked pieces instead of auto-cycling.
3. ALL controls SHALL keep the 56-pixel minimum target size and visible labels used by the
   rest of the app.
