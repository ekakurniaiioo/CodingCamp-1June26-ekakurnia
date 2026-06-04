# Implementation Plan: To-Do List Life Dashboard

## Overview

Implement a zero-dependency, single-page productivity dashboard in vanilla HTML/CSS/JavaScript. The app ships as three files (`index.html`, `css/style.css`, `js/script.js`) with no build step, backend, package manager dependency, or framework. Implementation proceeds in dependency order: static page scaffold → shared state and persistence → hero utilities → timer → task list → quick links → responsive styling and integration wiring.

---

## Tasks

- [x] 1. Scaffold project files and HTML structure
  - Create `index.html` with the full page skeleton: `<head>` containing charset, viewport, stylesheet link, and title; `<body>` containing `main.dashboard`.
  - Add a `header.card.hero-card` section with `#nameInput`, `#themeToggle`, `#time`, `#date`, and `#greeting`.
  - Add a `section.grid` with `aria-label="Dashboard features"` containing timer, tasks, and quick-links cards.
  - Add Focus Timer controls with `#timer`, `#startTimer`, `#stopTimer`, and `#resetTimer`.
  - Add Task List controls with `#taskInput`, `#addTask`, `#taskMessage`, and `#taskList`.
  - Add Quick Links controls with `#linkNameInput`, `#linkUrlInput`, `#addLink`, and `#quickLinks`.
  - Load `css/style.css` and `js/script.js`.
  - _Requirements: 1.1, 1.2, 1.3, 11.5_

- [x] 2. Initialize DOM references and application state
  - Select all static DOM elements used by the dashboard at the top of `js/script.js`.
  - Load `tasks` from `localStorage.getItem("tasks")`, defaulting to an empty array when no saved data exists.
  - Load `links` from `localStorage.getItem("links")`, defaulting to an empty array when no saved data exists.
  - Load `userName` from `localStorage.getItem("userName")`, defaulting to an empty string.
  - Load `theme` from `localStorage.getItem("theme")`, defaulting to `light`.
  - Initialize timer state with `timerSeconds = 25 * 60` and `timerInterval = null`.
  - _Requirements: 2.8, 2.9, 3.1, 4.1, 4.8, 7.6, 7.7, 9.3, 9.4_

- [x] 3. Implement Hero Card clock, date, and greeting
  - [x] 3.1 Implement `updateClock()`
    - Create a new `Date` object on every call.
    - Render current time into `#time` using `toLocaleTimeString("en-US", { hour12: false })`.
    - Render current date into `#date` using weekday, month, day, and year options.
    - Map hours before 12 to "Good Morning", hours before 18 to "Good Afternoon", and all later hours to "Good Evening".
    - Append `, ${userName}` when the saved user name is non-empty.
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.2 Wire name persistence
    - Set `#nameInput.value` from the saved `userName` value during initialization.
    - Add an `input` listener that trims the field value, stores it in `userName`, writes it to Local Storage under `userName`, and refreshes the greeting.
    - _Requirements: 2.7, 2.8, 2.9_

  - [x] 3.3 Start live updates
    - Call `updateClock()` immediately during page initialization.
    - Register `setInterval(updateClock, 1000)` so the time, date, and greeting continue updating while the page is open.
    - _Requirements: 2.3_

- [x] 4. Implement Theme Toggle
  - [x] 4.1 Implement `applyTheme()`
    - If `theme === "dark"`, add `body.dark` and set the toggle label to "Light Mode".
    - Otherwise remove `body.dark` and set the toggle label to "Dark Mode".
    - _Requirements: 3.1, 3.3, 3.4, 11.3_

  - [x] 4.2 Wire theme switching and persistence
    - Add a click listener to `#themeToggle`.
    - Toggle `theme` between `light` and `dark`.
    - Save the selected value to Local Storage under `theme`.
    - Call `applyTheme()` after each change and once during initialization.
    - _Requirements: 3.2, 3.5, 3.6_

- [x] 5. Implement Focus Timer
  - [x] 5.1 Implement timer formatting and display
    - Write `formatTimer(seconds)` to convert total seconds into zero-padded `MM:SS`.
    - Write `updateTimerDisplay()` to render the current `timerSeconds` value into `#timer`.
    - Render the initial `25:00` value during page initialization.
    - _Requirements: 4.1, 4.3_

  - [x] 5.2 Implement Start control
    - Add a click listener to `#startTimer`.
    - If `timerInterval` already exists, return early.
    - Otherwise create a one-second interval that decrements `timerSeconds` and updates the display.
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 5.3 Implement Stop, Reset, and completion notification
    - Add a click listener to `#stopTimer` that clears the active interval and sets `timerInterval = null`.
    - Add a click listener to `#resetTimer` that clears the active interval, restores `timerSeconds = 25 * 60`, and updates the display.
    - When the countdown reaches zero, clear the active interval, set `timerInterval = null`, and show `alert("Focus session finished!")`.
    - Keep timer state in memory only; do not write it to Local Storage.
    - _Requirements: 4.5, 4.6, 4.7, 4.8_

- [x] 6. Implement To-Do List add and display behaviour
  - [x] 6.1 Implement task persistence helper
    - Write `saveTasks()` to serialize the full `tasks` array and store it under the Local Storage key `tasks`.
    - _Requirements: 7.2, 7.6_

  - [x] 6.2 Implement `addTask()`
    - Trim the current `#taskInput` value.
    - Clear `#taskMessage` before validation.
    - Reject empty input with "Task cannot be empty.".
    - Reject case-insensitive duplicates with "This task already exists.".
    - Push `{ text: taskText, done: false }` for valid input.
    - Clear the input, save the collection, and call `renderTasks()`.
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_

  - [x] 6.3 Wire task submission controls
    - Add a click listener to `#addTask` that calls `addTask()`.
    - Add a `keydown` listener to `#taskInput` that calls `addTask()` when `event.key === "Enter"`.
    - _Requirements: 5.2, 5.3_

  - [x] 6.4 Implement `renderTasks()`
    - Clear `#taskList` before rendering.
    - For each Task, create an `li.task-item`; add the `done` class when `task.done` is true.
    - Render a checkbox reflecting `task.done`, a text span, an Edit button, and a Delete button.
    - Append the generated task row into `#taskList`.
    - Call `renderTasks()` during initialization so saved tasks appear on load.
    - _Requirements: 5.7, 7.1, 7.3, 7.7_

- [x] 7. Implement To-Do List edit, complete, and delete behaviour
  - [x] 7.1 Implement completion toggle
    - Bind a `change` listener to each task checkbox while rendering.
    - Update the matching Task's `done` value from the checkbox state.
    - Save the collection and re-render the list.
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 7.2 Implement prompt-based task editing
    - Bind an Edit button listener for each rendered Task.
    - Open `prompt("Edit task:", task.text)` with the current task text.
    - Ignore cancelled, empty, or whitespace-only prompt results.
    - Reject case-insensitive duplicates against other tasks with `alert("Task already exists!")`.
    - Save and re-render after a valid edit.
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 7.3 Implement task deletion
    - Bind a Delete button listener for each rendered Task.
    - Remove the Task with `tasks.splice(index, 1)`.
    - Save the collection and re-render the list.
    - _Requirements: 7.4, 7.5, 7.6_

- [x] 8. Implement Quick Links add and display behaviour
  - [x] 8.1 Implement link persistence helper
    - Write `saveLinks()` to serialize the full `links` array and store it under the Local Storage key `links`.
    - _Requirements: 9.2, 9.3_

  - [x] 8.2 Implement `addLink()`
    - Trim the current `#linkNameInput` and `#linkUrlInput` values.
    - Reject missing name or URL with `alert("Please fill link name and URL.")`.
    - Prefix URLs with `https://` when they do not start with `http://` or `https://`.
    - Push `{ name, url }` into `links`.
    - Clear both link inputs, save the collection, and call `renderLinks()`.
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6, 8.7_

  - [x] 8.3 Wire link submission control
    - Add a click listener to `#addLink` that calls `addLink()`.
    - _Requirements: 8.1, 8.2_

  - [x] 8.4 Implement `renderLinks()`
    - Clear `#quickLinks` before rendering.
    - For each Link, create a `.link-item` wrapper.
    - Render an anchor with `href = link.url`, `target = "_blank"`, and text from `link.name`.
    - Render a delete button labelled `×`.
    - Append the generated link item into `#quickLinks`.
    - Call `renderLinks()` during initialization so saved links appear on load.
    - _Requirements: 8.4, 8.8, 9.4_

  - [x] 8.5 Implement quick link deletion
    - Bind a delete button listener for each rendered Link.
    - Remove the Link with `links.splice(index, 1)`.
    - Save the collection and re-render the panel.
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 9. Apply CSS styles and responsive layout
  - [x] 9.1 Write base styles and theme variables in `css/style.css`
    - Apply a reset for `box-sizing`, margin, and padding.
    - Define light theme custom properties on `:root`.
    - Define dark theme custom property overrides on `body.dark`.
    - Set the page font to `Arial, sans-serif`.
    - _Requirements: 3.3, 3.4, 11.1, 11.2, 11.3_

  - [x] 9.2 Style cards, controls, tasks, and links
    - Style `.dashboard`, `.card`, `.hero-card`, `.top-actions`, headings, inputs, buttons, and button groups.
    - Style `#time` and `#timer` as prominent primary-coloured display values.
    - Style completed tasks with line-through and muted text.
    - Style quick links as primary-coloured chips with compact delete buttons.
    - _Requirements: 7.3, 8.4, 11.4_

  - [x] 9.3 Implement responsive layout
    - Use a two-column grid for timer and task cards on larger viewports.
    - Make `.links-card` span the full grid width.
    - At `max-width: 768px`, switch the grid to one column and stack `.top-actions` and `.input-group`.
    - Reduce large display text sizes on smaller screens.
    - _Requirements: 10.3, 10.4_

- [x] 10. Final integration
  - Start the live clock interval with `setInterval(updateClock, 1000)`.
  - Apply the saved theme.
  - Render the clock, timer, saved tasks, and saved quick links during initial script execution.
  - Confirm the implemented app remains static and uses only browser-native APIs.
  - _Requirements: 1.2, 1.4, 2.3, 3.6, 4.1, 5.7, 8.8, 10.1_

---

## Notes

- All checklist items are marked complete because the current project already implements the described functionality.
- The current implementation uses `js/script.js`; it does not use `js/app.js`.
- The clock uses 24-hour `en-US` time and updates every second.
- The Focus Timer state is intentionally non-persistent; a page reload always resets it to `25:00`.
- Task duplicates are prevented case-insensitively for add and edit operations.
- Quick link duplicates are allowed by the current implementation.
- Quick link URLs without `http://` or `https://` are normalized by adding `https://`; they are not rejected.
- There are no automated tests, no storage utility wrapper, no malformed JSON recovery, and no explicit Local Storage write-failure handling in the current implementation.

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "9.1"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1", "6.1", "8.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "5.2", "5.3", "6.2", "8.2"] },
    { "id": 4, "tasks": ["6.3", "6.4", "7.1", "7.2", "7.3", "8.3", "8.4", "8.5", "9.2"] },
    { "id": 5, "tasks": ["9.3", "10"] }
  ]
}
```
