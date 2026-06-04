# Design Document — To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a zero-dependency, single-page web application that runs entirely in the browser. There is no server, no build step, no package manager, and no JavaScript framework. The page consists of four visible dashboard areas — a Hero Card, a Focus Timer, a To-Do List, and a Quick Links panel — with persistent user state stored through the browser's `localStorage` API.

The entire application ships as three source files:

```text
index.html          ← markup and dashboard structure
css/style.css       ← all styles, theme variables, and responsive layout
js/script.js        ← all logic, event handling, timer behaviour, and localStorage I/O
```

This constraint keeps the codebase small and direct. The implementation uses top-level DOM references, top-level state variables, and standalone functions rather than framework components or bundled modules.

---

## Architecture

The application follows a **flat browser-script architecture** inside `js/script.js`. The script selects all required DOM elements once at load time, initializes state from Local Storage, binds event listeners, and renders each dynamic section with direct DOM updates.

```text
┌─────────────────────────────────────────────────────────┐
│                       index.html                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Hero Card: name input, theme toggle, time/date    │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌──────────────────┐  ┌────────────────────────────┐   │
│  │  Focus Timer     │  │        Task List           │   │
│  └──────────────────┘  └────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Quick Links                                       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                     js/script.js                        │
│  DOM references                                          │
│  State: tasks, links, userName, theme, timerSeconds      │
│  Functions: updateClock, applyTheme, renderTasks,        │
│             addTask, formatTimer, renderLinks, addLink   │
│  Event listeners: input, click, keydown, setInterval     │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    Browser APIs                         │
│  localStorage                                            │
│  Date                                                    │
│  setInterval / clearInterval                             │
│  alert / prompt                                          │
│  DOM createElement / appendChild                         │
└─────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **No frameworks** — vanilla DOM APIs are sufficient for the current feature set.
- **No backend** — all user data is stored in the current browser only.
- **Single script file** — all event binding, rendering, and persistence logic lives in `js/script.js`.
- **Local Storage persistence** — user name, theme, tasks, and quick links are restored on page load.
- **Timer state is volatile** — focus timer remaining time and running state live only in memory and reset on reload.
- **Full re-render for lists** — task and link collections clear their containers and rebuild DOM nodes after mutations.

---

## Components

### 1. Hero Card

**Responsibility:** Display the current time, current date, personalized greeting, saved name input, and theme toggle.

**DOM targets:**

```js
#nameInput
#themeToggle
#time
#date
#greeting
```

**State:**

```js
let userName = localStorage.getItem("userName") || "";
let theme = localStorage.getItem("theme") || "light";
```

**Implemented behaviour:**

- `updateClock()` creates a new `Date`, writes the current time into `#time`, writes the current date into `#date`, and writes the greeting into `#greeting`.
- Time is formatted with `toLocaleTimeString("en-US", { hour12: false })`.
- Date is formatted with `toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })`.
- Greeting rules are simple hour bands: before 12 is "Good Morning", 12 through 17 is "Good Afternoon", and 18 onward is "Good Evening".
- `#nameInput` saves the trimmed name to Local Storage on every input event.
- `applyTheme()` adds or removes `body.dark` and updates the theme toggle label.
- `#themeToggle` persists the next theme value to Local Storage and reapplies theme styles.

---

### 2. Focus Timer

**Responsibility:** Provide a 25-minute countdown with Start, Stop, and Reset controls.

**DOM targets:**

```js
#timer
#startTimer
#stopTimer
#resetTimer
```

**State:**

```js
let timerSeconds = 25 * 60;
let timerInterval = null;
```

**Implemented behaviour:**

- `formatTimer(seconds)` converts seconds to a zero-padded `MM:SS` string.
- `updateTimerDisplay()` writes the formatted value into `#timer`.
- The Start handler returns early when `timerInterval` already exists, preventing duplicate intervals.
- The active interval decrements `timerSeconds` every 1000ms while the remaining value is above zero.
- The Stop handler clears the active interval and sets `timerInterval` back to `null`.
- The Reset handler clears the active interval, sets `timerSeconds` to `1500`, and renders `25:00`.
- When the interval observes that the timer has reached zero, it clears itself and displays `alert("Focus session finished!")`.

---

### 3. Task List

**Responsibility:** Add, edit, complete, delete, render, and persist tasks.

**DOM targets:**

```js
#taskInput
#addTask
#taskMessage
#taskList
```

**State:**

```js
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
```

**Implemented behaviour:**

- `addTask()` trims the input value, rejects empty text, rejects case-insensitive duplicates, appends a Task object, persists the collection, clears the input, and re-renders.
- `saveTasks()` writes the full task array to Local Storage with `JSON.stringify`.
- `renderTasks()` clears `#taskList` and creates a `<li>` for every Task.
- Each rendered Task contains a checkbox, text `<span>`, Edit button, and Delete button.
- Checkbox changes update `task.done`, persist the collection, and re-render.
- Edit uses `prompt("Edit task:", task.text)`.
- Empty edit values and cancelled prompts are ignored.
- Duplicate edit values are rejected with `alert("Task already exists!")`.
- Delete removes the task with `splice(index, 1)`, persists the collection, and re-renders.

---

### 4. Quick Links

**Responsibility:** Add, open, delete, render, and persist quick links.

**DOM targets:**

```js
#linkNameInput
#linkUrlInput
#addLink
#quickLinks
```

**State:**

```js
let links = JSON.parse(localStorage.getItem("links")) || [];
```

**Implemented behaviour:**

- `addLink()` trims the name and URL inputs.
- Missing name or URL is rejected with `alert("Please fill link name and URL.")`.
- URLs that do not start with `http://` or `https://` are normalized by prefixing `https://`.
- Link objects are appended to `links`, saved to Local Storage, and rendered.
- `renderLinks()` clears `#quickLinks` and creates one `.link-item` wrapper per Link.
- Each Link renders as an `<a>` with `target="_blank"` and a delete button labelled `×`.
- Delete removes the link with `splice(index, 1)`, persists the collection, and re-renders.
- Duplicate links are allowed by the current implementation.

---

## Data Models

### Task

```js
{
  text: string,  // non-empty, trimmed task text
  done: boolean  // false on creation, true when completed
}
```

Tasks are stored as a JSON array under the Local Storage key `tasks`.

### Link

```js
{
  name: string, // non-empty, trimmed display text
  url: string   // trimmed URL, prefixed with https:// when no HTTP(S) scheme exists
}
```

Links are stored as a JSON array under the Local Storage key `links`.

### User Name

```js
"Alex"
```

The user name is stored as a plain string under the Local Storage key `userName`. Empty input is persisted as an empty string.

### Theme

```js
"light" | "dark"
```

The theme is stored as a plain string under the Local Storage key `theme`. Any value other than `dark` is treated by `applyTheme()` as light mode.

### Focus Timer State

```js
{
  timerSeconds: 1500,
  timerInterval: null
}
```

The Focus Timer does **not** persist to Local Storage. If the page is reloaded, the timer resets to `25:00` and is not running.

---

## Local Storage Keys

| Feature | Key | Stored Value | Default | Write Path |
|---|---|---|---|---|
| Task List | `tasks` | JSON array of `{ text, done }` objects | `[]` | `saveTasks()` |
| Quick Links | `links` | JSON array of `{ name, url }` objects | `[]` | `saveLinks()` |
| Personalized Greeting | `userName` | Plain string | `""` | `#nameInput` input listener |
| Theme Toggle | `theme` | `"light"` or `"dark"` | `"light"` | `#themeToggle` click listener |

The implementation reads `tasks` and `links` with `JSON.parse(localStorage.getItem(key)) || []`. It does not include a parsing fallback for malformed JSON.

---

## UI Structure

```text
body
└── main.dashboard
    ├── header.card.hero-card
    │   ├── div.top-actions
    │   │   ├── input#nameInput
    │   │   └── button#themeToggle
    │   ├── h1#time
    │   ├── p#date
    │   └── h2#greeting
    │
    └── section.grid[aria-label="Dashboard features"]
        ├── section.card.timer-card
        │   ├── h2
        │   ├── div#timer
        │   └── div.button-group
        │       ├── button#startTimer
        │       ├── button#stopTimer.secondary
        │       └── button#resetTimer.secondary
        │
        ├── section.card.tasks-card
        │   ├── h2
        │   ├── div.input-group
        │   │   ├── input#taskInput
        │   │   └── button#addTask
        │   ├── p#taskMessage.message
        │   └── ul#taskList
        │
        └── section.card.links-card
            ├── h2
            ├── div.input-group.links-input
            │   ├── input#linkNameInput
            │   ├── input#linkUrlInput
            │   └── button#addLink
            └── div#quickLinks.quick-links
```

---

## Styling Design

The stylesheet uses CSS custom properties to define the active colour palette. Light mode values are declared on `:root`; dark mode overrides are declared on `body.dark`.

```css
:root {
    --bg: #eef2ff;
    --card: #ffffff;
    --text: #222222;
    --muted: #666666;
    --primary: #5b6ee1;
    --danger: #e85d5d;
    --border: #dddddd;
}
```

**Layout and visual hierarchy:**

- The body uses `Arial, sans-serif`, a full viewport minimum height, and 24px page padding.
- `.dashboard` constrains content to `max-width: 1000px` and centers it.
- `.card` provides the shared visual treatment: background, border, 12px radius, 24px padding, and bottom spacing.
- `.hero-card` centers the clock, date, and greeting.
- `.grid` uses two equal columns for the timer and task sections.
- `.links-card` spans both columns.
- At `max-width: 768px`, the grid becomes one column and `.top-actions` / `.input-group` stack vertically.

**Component styling:**

- `#time` and `#timer` use larger type and the primary colour.
- Secondary timer buttons use neutral colours that adapt in dark mode.
- Delete buttons use the danger colour.
- Completed tasks use `.task-item.done span` with `text-decoration: line-through` and muted text.
- Quick links render as primary-coloured chips with white anchor text and a compact delete button.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Empty task submission | `addTask()` rejects the operation and writes "Task cannot be empty." into `#taskMessage`. |
| Duplicate task submission | `addTask()` rejects the operation and writes "This task already exists." into `#taskMessage`. |
| Empty or cancelled task edit | The edit handler returns without changing the Task. |
| Duplicate task edit | The edit handler rejects the operation and shows `alert("Task already exists!")`. |
| Missing quick link name or URL | `addLink()` rejects the operation and shows `alert("Please fill link name and URL.")`. |
| Quick link URL without HTTP(S) scheme | `addLink()` prefixes `https://` and saves the normalized URL. |
| Timer reaches zero | The interval is cleared and `alert("Focus session finished!")` is shown. |
| No task data exists | `JSON.parse(localStorage.getItem("tasks")) || []` initializes an empty task list. |
| No link data exists | `JSON.parse(localStorage.getItem("links")) || []` initializes an empty quick-links panel. |
| Malformed JSON in `tasks` or `links` | No explicit handling exists; `JSON.parse` can throw during script initialization. |
| Local Storage write failure | No explicit handling exists; `localStorage.setItem` errors can propagate. |
| Browser blocks new tab | No explicit handling exists; the browser's own behaviour applies to the anchor opened with `target="_blank"`. |
