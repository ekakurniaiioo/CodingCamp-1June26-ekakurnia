# Requirements Document

## Introduction

The To-Do List Life Dashboard is a standalone, client-side web application that serves as a compact personal productivity dashboard. It combines a live local clock and date, a personalized time-of-day greeting, a light/dark theme toggle, a 25-minute focus timer, a persistent to-do list, and a persistent quick-links panel in a single HTML/CSS/Vanilla JavaScript page backed by the browser's Local Storage API. No server, build tool, package manager, or JavaScript framework is required.

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Hero_Card**: The top UI section that displays the current time, date, greeting, name input, and theme toggle.
- **Greeting**: The time-of-day message displayed as "Good Morning", "Good Afternoon", or "Good Evening", optionally followed by the saved user name.
- **Focus_Timer**: The UI section that implements a 25-minute countdown timer with Start, Stop, and Reset controls.
- **Task_List**: The UI section that manages a collection of to-do items.
- **Task**: A single to-do item consisting of a text value and a completion state.
- **Quick_Links**: The UI section that manages a collection of user-defined URL shortcuts rendered as clickable link chips.
- **Link**: A single quick-access entry consisting of a display name and URL.
- **Theme**: The visual mode of the Dashboard, either `light` or `dark`.
- **Local_Storage**: The browser's `localStorage` API, used as the sole persistence mechanism.
- **Modern_Browser**: Chrome (latest stable), Firefox (latest stable), Edge (latest stable), and Safari (latest stable).

---

## User Stories

- As a developer, I want the project to remain a small static application, so that it can run directly in a browser without setup or infrastructure.
- As a user, I want to see the current time, date, and a personalized greeting when I open the dashboard, so that I immediately know the time of day and feel welcomed.
- As a user, I want to switch between light and dark mode, so that the dashboard remains comfortable to use in different lighting conditions.
- As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can work in focused sessions.
- As a user, I want to add tasks to my to-do list and see them displayed, so that I can track what I need to do.
- As a user, I want to edit an existing task's text, so that I can correct mistakes or update what needs to be done.
- As a user, I want to mark tasks as done, delete tasks I no longer need, and have those changes saved automatically, so that my list remains accurate after refreshes.
- As a user, I want to save favourite website URLs as labelled quick links, so that I can open them quickly from the dashboard.
- As a user, I want to remove quick links I no longer need and have the remaining links saved, so that the panel stays relevant and uncluttered.
- As a user, I want the dashboard to feel fast and respond immediately to my actions, so that it does not interrupt my workflow.
- As a user, I want a clean, readable interface with clear visual hierarchy, so that I can quickly find and use each dashboard section.

---

## Requirements

### Requirement 1: Project Structure and Technical Constraints

**User Story:** As a developer, I want the project to remain a small static application, so that it can run directly in a browser without setup or infrastructure.

#### Acceptance Criteria

1. THE Dashboard SHALL be delivered as exactly one `index.html` file, exactly one CSS file located at `css/style.css`, and exactly one JavaScript file located at `js/script.js`.
2. THE Dashboard SHALL function without a backend server, build tool, package manager dependency, or JavaScript framework.
3. THE Dashboard SHALL load its stylesheet through a `<link>` element and load its JavaScript through a `<script>` element in `index.html`.
4. THE Dashboard SHALL use browser-native DOM APIs, `Date`, `setInterval`, `alert`, `prompt`, and `localStorage` for its implemented behaviour.

---

### Requirement 2: Live Clock, Date, and Personalized Greeting

**User Story:** As a user, I want to see the current time, date, and a personalized greeting when I open the dashboard, so that I immediately know the time of day and feel welcomed.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Hero_Card SHALL display the current local time in `en-US` 24-hour format using the browser's `toLocaleTimeString` API with `hour12: false`.
2. WHEN the Dashboard loads, THE Hero_Card SHALL display the current local date in a human-readable `en-US` format that includes weekday, month, day, and year.
3. WHILE the Dashboard is open, THE Hero_Card SHALL update the displayed time, date, and greeting every 1 second without requiring a page reload.
4. WHEN the current local hour is less than 12, THE Greeting SHALL display "Good Morning".
5. WHEN the current local hour is greater than or equal to 12 and less than 18, THE Greeting SHALL display "Good Afternoon".
6. WHEN the current local hour is greater than or equal to 18, THE Greeting SHALL display "Good Evening".
7. WHEN the user types a non-empty name into `#nameInput`, THE Greeting SHALL append the trimmed name after a comma.
8. WHEN the user changes the value of `#nameInput`, THE Dashboard SHALL persist the trimmed value to Local_Storage under the key `userName`.
9. WHEN the Dashboard loads and `userName` exists in Local_Storage, THE Dashboard SHALL restore that value into `#nameInput`.

---

### Requirement 3: Theme Toggle

**User Story:** As a user, I want to switch between light and dark mode, so that the dashboard remains comfortable to use in different lighting conditions.

#### Acceptance Criteria

1. WHEN the Dashboard loads with no saved theme, THE Dashboard SHALL use the light theme by default.
2. WHEN the user activates `#themeToggle`, THE Dashboard SHALL toggle the theme value between `light` and `dark`.
3. WHEN the selected theme is `dark`, THE Dashboard SHALL add the `dark` class to the `<body>` element and display the button label "Light Mode".
4. WHEN the selected theme is `light`, THE Dashboard SHALL remove the `dark` class from the `<body>` element and display the button label "Dark Mode".
5. WHEN the theme changes, THE Dashboard SHALL persist the selected value to Local_Storage under the key `theme`.
6. WHEN the Dashboard loads and `theme` exists in Local_Storage, THE Dashboard SHALL apply the saved theme before user interaction.

---

### Requirement 4: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can work in focused sessions.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Focus_Timer SHALL display a countdown initialised to `25:00`.
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down in one-second intervals from the current remaining time.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time in zero-padded `MM:SS` format.
4. IF the Focus_Timer is already counting down and the user activates the Start control again, THEN THE Focus_Timer SHALL ignore the duplicate activation and continue with one active interval.
5. WHEN the user activates the Stop control, THE Focus_Timer SHALL clear the active interval and retain the current remaining time.
6. WHEN the user activates the Reset control, THE Focus_Timer SHALL clear any active interval and reset the displayed time to `25:00`.
7. WHEN the countdown reaches zero, THE Focus_Timer SHALL stop automatically and notify the user with the browser alert message "Focus session finished!".
8. THE Focus_Timer SHALL keep its remaining time and running state in memory only; a page reload SHALL reset the timer to `25:00`.

---

### Requirement 5: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to my to-do list and see them displayed, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Task_List SHALL provide a text input field `#taskInput` and an "Add" control `#addTask` for submitting new tasks.
2. WHEN the user submits a non-empty task text using the Add control, THE Task_List SHALL append a new Task to the list with `done` set to `false`.
3. WHEN the user presses Enter while focused in `#taskInput`, THE Task_List SHALL attempt to add the current input value.
4. IF the user attempts to submit an empty or whitespace-only task, THEN THE Task_List SHALL reject the submission and display the inline message "Task cannot be empty." in `#taskMessage`.
5. IF the user attempts to submit a Task whose text matches an existing Task case-insensitively, THEN THE Task_List SHALL reject the submission and display the inline message "This task already exists." in `#taskMessage`.
6. WHEN a Task is added successfully, THE Task_List SHALL clear `#taskInput`, persist the full task collection, and re-render the task list.
7. WHEN the Dashboard loads, THE Task_List SHALL restore and display all Tasks previously saved in Local_Storage.

---

### Requirement 6: To-Do List — Edit Tasks

**User Story:** As a user, I want to edit an existing task's text, so that I can correct mistakes or update what needs to be done.

#### Acceptance Criteria

1. THE Task_List SHALL provide an "Edit" control for each rendered Task.
2. WHEN the user activates the Edit control for a Task, THE Task_List SHALL open a browser `prompt` pre-filled with the Task's current text.
3. WHEN the user submits a non-empty, non-duplicate edit value, THE Task_List SHALL update the Task text, persist the full task collection, and re-render the list.
4. IF the user submits an empty or whitespace-only edit value, THEN THE Task_List SHALL ignore the edit and retain the Task's original text.
5. IF the user cancels the browser prompt, THEN THE Task_List SHALL retain the Task's original text.
6. IF the user submits an edit value that matches another Task case-insensitively, THEN THE Task_List SHALL reject the edit and display the browser alert message "Task already exists!".

---

### Requirement 7: To-Do List — Complete, Delete, and Persist Tasks

**User Story:** As a user, I want to mark tasks as done, delete tasks I no longer need, and have those changes saved automatically, so that my list remains accurate after refreshes.

#### Acceptance Criteria

1. THE Task_List SHALL provide a checkbox control for each Task to change its completion state.
2. WHEN the user toggles a Task checkbox, THE Task_List SHALL update the Task's `done` state, persist the full task collection, and re-render the list.
3. WHEN a Task's `done` state is `true`, THE Task_List SHALL visually distinguish it with the `done` class, strikethrough text, and muted text colour.
4. THE Task_List SHALL provide a "Delete" control for each Task.
5. WHEN the user activates the Delete control for a Task, THE Task_List SHALL remove the Task from the list, persist the full task collection, and re-render the list.
6. THE Task_List SHALL store the task collection in Local_Storage under the key `tasks`.
7. IF no task data exists in Local_Storage, THEN THE Task_List SHALL render an empty list without errors.

---

### Requirement 8: Quick Links — Add and Display Links

**User Story:** As a user, I want to save favourite website URLs as labelled quick links, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links panel SHALL provide a name input field `#linkNameInput`, a URL input field `#linkUrlInput`, and an "Add Link" control `#addLink`.
2. WHEN the user submits a Link with a non-empty name and non-empty URL, THE Quick_Links panel SHALL add the Link and render it as a clickable anchor.
3. IF the submitted URL does not start with `http://` or `https://`, THEN THE Quick_Links panel SHALL prefix the URL with `https://` before saving.
4. WHEN the user activates a rendered Link anchor, THE Quick_Links panel SHALL open the Link's URL in a new browser tab using `target="_blank"`.
5. IF the user submits a Link with an empty name or empty URL, THEN THE Quick_Links panel SHALL reject the submission and display the browser alert message "Please fill link name and URL."
6. WHEN a Link is added successfully, THE Quick_Links panel SHALL clear both link input fields, persist the full link collection, and re-render the panel.
7. THE Quick_Links panel SHALL allow duplicate Link names and URLs because the current implementation does not enforce uniqueness.
8. WHEN the Dashboard loads, THE Quick_Links panel SHALL restore and display all Links previously saved in Local_Storage.

---

### Requirement 9: Quick Links — Delete and Persist Links

**User Story:** As a user, I want to remove quick links I no longer need and have the remaining links saved, so that the panel stays relevant and uncluttered.

#### Acceptance Criteria

1. THE Quick_Links panel SHALL provide a delete control labelled `×` for each rendered Link.
2. WHEN the user activates the delete control for a Link, THE Quick_Links panel SHALL remove the Link from the collection, persist the full link collection, and re-render the panel.
3. THE Quick_Links panel SHALL store the link collection in Local_Storage under the key `links`.
4. IF no link data exists in Local_Storage, THEN THE Quick_Links panel SHALL render an empty panel without errors.

---

### Requirement 10: Performance and Responsiveness

**User Story:** As a user, I want the dashboard to feel fast and respond immediately to my actions, so that it does not interrupt my workflow.

#### Acceptance Criteria

1. THE Dashboard SHALL complete its initial render without making network requests after the initial local page load.
2. WHEN the user interacts with implemented controls for theme, name input, timer, tasks, or quick links, THE Dashboard SHALL update the relevant UI synchronously or on the next scheduled timer tick.
3. THE Dashboard SHALL remain usable on narrow viewports by stacking the main grid and input groups at widths of 768px or less.
4. THE Dashboard SHALL constrain the main content width to `1000px` on larger viewports.

---

### Requirement 11: Visual Design and Accessibility

**User Story:** As a user, I want a clean, readable interface with clear visual hierarchy, so that I can quickly find and use each dashboard section.

#### Acceptance Criteria

1. THE Dashboard SHALL apply a single external stylesheet loaded from the `css/` directory.
2. THE Dashboard SHALL define at least one font family in `css/style.css`.
3. THE Dashboard SHALL use CSS custom properties for light and dark theme colours.
4. THE Dashboard SHALL visually group the hero, timer, task list, and quick links sections as cards.
5. THE Dashboard SHALL expose the main feature grid with the accessible label "Dashboard features".
