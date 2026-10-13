# Daytone — first product plan

A quiet productivity tracker where focused time becomes a collection of colored, rounded squares. The visual style is inspired by iPhone cards and controls: generous rounding, soft surfaces, restrained typography, warm-to-green colors, and very little setup.

## First version: implemented in this demo

| Area | Decision |
|---|---|
| Home | Week is the default view. Desktop pairs history with a timer; narrow screens put focus controls first. |
| Focus | Countdown, open-ended stopwatch, and customizable Pomodoro. Pause/resume and partial-session saving. |
| Pomodoro | Work/break lengths and round count. Manual next-phase start avoids recording unattended rounds. |
| Daily tiles | Color interpolates from red to orange, amber, lime, and green over 0–8h; 8h+ stays green. |
| History | Day: hourly tiles; week/month: daily tiles; year: monthly tiles; all time: yearly tiles. Drill down from aggregate tiles. |
| Aggregates | Color comes from average daily focused seconds, not an arithmetic average of color values. Include zero-focus calendar days since tracking began. Exclude future dates. |
| Profile | Random animal avatar, editable name, background colored by all-time daily average. |
| Goal | Adjustable daily intention, initially 4h. Does not change the fixed 8h color scale. |
| Sessions | Optional short label, recent history, individual deletion with confirmation. No project-management overhead. |
| Data | Local-only persistence, JSON export/import, separate sample and personal spaces. |
| Feedback | Timer completion sound while open; toast confirmation; current-day outline. |

Current-day colors are provisional and update on session completion. Breaks and pauses never count. If a session crosses midnight, each day receives its actual portion. Year/month averages include the current partial day; the interface explains this. The first partial tracking day counts as one calendar day.

The sample space starts with 66 calendar days of synthetic history. It does not modify personal tracking. A green day indicates time recorded, not the quality or importance of work. Eight hours is a color ceiling, not a recommendation to work eight hours every day.

## Intentional boundaries

This is a reviewable functional prototype, not an app-store-ready product. It does not block other apps, validate that the user was working, synchronize devices, run a native background service, or send background notifications. The UI has responsive mobile styling, but no iOS or Android binary has been built.

For the Windows prototype, a small C executable embeds the UI and opens Edge in app mode. It extracts to a stable local app-data location and uses a dedicated profile. There is no local web server or dependency installation for the user. Data is browser localStorage; the backup feature is important.

Timer duration is reconstructed from timestamps instead of counting UI ticks. This withstands delayed browser callbacks and reopening the app, but is not immune to changing the system clock. Stopwatch counts time while closed/asleep until stopped. Countdown credits at most its configured length. Pomodoro requires a deliberate start between phases. Completion sound is only best-effort while the app is open.

## Path to iOS and Android

Recommended next step: keep the HTML/CSS/JavaScript interface and pure time model, then package the mobile version using Capacitor. Its official targets include iOS, Android and web. There is no need to learn every framework before making progress; AI can handle much of the implementation, while you own product decisions and device testing.

Official references:
- https://capacitorjs.com/docs
- https://capacitorjs.com/docs/getting-started/environment-setup

Before committing to an app-store release:
1. Refine this demo from screenshots and actual use. Decide the name, color thresholds, navigation, and timer behavior.
2. Put source under version control; retain one runnable version before each change.
3. Create Capacitor iOS/Android projects. Adapt touch navigation, safe areas, large text, and reduced motion. Add app icons and a proper launch screen.
4. Replace localStorage with durable mobile storage (for example a reviewed SQLite integration), a versioned schema, and migrations. Record session timestamps plus timezone context to keep history stable while travelling.
5. Implement native local notifications. Store the deadline before backgrounding; reconcile time on resume. Do not rely on a JavaScript interval staying active with the screen locked.
6. Test real devices: lock/unlock, calls, sleep, app force-close, restart, midnight, DST, timezone changes, permissions denied, low battery, and restore. Test VoiceOver/TalkBack and large text.
7. Run closed beta distribution before public stores. Add store assets, privacy disclosures, and signed releases. Account/sync can come later if users need it.

Official iOS build tooling uses Xcode on macOS; a Mac or an appropriate hosted macOS build workflow is needed. Android uses the Android toolchain. These release steps cannot be replaced by merely renaming the Windows EXE.

## Data model

- Space: tracking start date, display name, avatar, daily intention, timer preferences.
- Session: unique ID, label, mode, and one or more focus intervals [start, end] in epoch milliseconds.
- Active timer: phase, round, configured durations, closed intervals, current interval start, and waiting state.
- Daily totals: derived by splitting saved focus intervals at local midnight; not independently editable counters.
- Backup: versioned JSON containing one space and saved sessions; active timers excluded.

Keep the model independent of the screen. `core.js` contains the reusable calculations. `app.js` handles the current screens and local storage. Replacing the storage adapter and adding native notifications should not require rewriting color arithmetic.

## Simple AI-led workflow

Ask for one concrete change at a time: “Make the week tiles larger”, “Change the scale so 2h is yellow-green”, or “Add long breaks every fourth Pomodoro.” Have the AI describe what changed and test the behavior before replacing your working version. You do not need to study every technology, but you should understand what the app records, where it saves it, and the limits of its timers.

After the visual direction is settled, the next useful milestone is a real Android test build, followed by an iOS test build. Avoid adding subscriptions, social feeds, badges, complex task management, and cloud accounts until the core loop feels good.

## Open decisions for the next iteration

- Should full green remain 8h, or follow the user's daily goal?
- Should rest days be explicitly excluded from averages?
- Should Pomodoro advance automatically while the app stays in the foreground?
- Is an animal avatar the final style, or should we use illustrated characters?
- Would week be better as seven large cards or a compact calendar grid on phones?

These are refinement questions, not blockers: the demo already makes consistent defaults.
