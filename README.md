# Gupio TaskHub — Task Management Dashboard

**Assignment:** Gupio Campus Placement Development Assignment — Frontend Developer (Option 1: Task Management Dashboard)  
**Project Name:** Gupio TaskHub  
**Subtitle:** Task Management Dashboard  
*Note: This frontend project was built specifically for the Gupio placement assignment.*

---

## 🌟 Overview

**Gupio TaskHub** is a responsive, modern SaaS-grade task management dashboard built using **React**, **Vite**, and **localStorage**. It enables teams to create, track, organize, and manage workplace tasks with instant search, status and priority filters, dynamic metrics, overdue and due-today badges, and smooth modal interactions—completely frontend-only without requiring any external backend or database.

---

## 🚀 Key Features

1. **Full CRUD Operations**:
   - **Create Tasks**: Reusable form modal with inline validation (title, description, status, priority, due date).
   - **List & View Tasks**: Dual-view support—toggle seamlessly between modern **Card Grid View** and high-density **Table View**.
   - **Inspect Task Details**: Dedicated details modal displaying full descriptions, tags, status changer, and creation & last-update timestamps.
   - **Edit Tasks**: Instant updates with validation and automatic `updatedAt` tracking.
   - **Safe Delete**: Two-step deletion guarded by a custom confirmation dialog.

2. **Workplace Productivity Attributes**:
   - **Status Management**: `Todo`, `In Progress`, and `Completed`.
   - **Priority Management**: `Low`, `Medium`, and `High` with visual indicators.
   - **Due Date Intelligence**:
     - 🔴 **Overdue Indicator**: Prominently highlights tasks whose due date has passed and are not marked `Completed`.
     - 🟣 **Due Today Indicator**: Highlights tasks that are due before end of the current calendar day.
     - 🟢 **Visual Completion**: Strikethrough titles, green accents, and subtle styling for completed tasks.
     - ⚡ **Quick Complete Toggle**: One-click checkmark toggle directly from cards or table rows.

3. **Dynamic Metrics & Statistics**:
   - **Total Tasks**, **Todo**, **In Progress**, **Completed**, and **High Priority** counts calculated dynamically.
   - **Interactive Stat Cards**: Clicking any stat card instantly filters the task list to that category.
   - Completion percentage tracker.

4. **Instant Search & Filtering**:
   - Real-time search by **task title** and **task description**.
   - Status filters: `All`, `Todo`, `In Progress`, `Completed`, `Overdue`, and `Due Today`.
   - Priority filters: `All`, `High`, `Medium`, `Low`.
   - Sorting options: `Newest First`, `Oldest First`, `Due Date (Earliest)`, `Due Date (Latest)`, and `Priority (High to Low)`.
   - Active filter counter and one-click "Reset Filters" action.

5. **Polish & UX**:
   - **Toast Notifications**: Lightweight notification system providing feedback on create, edit, delete, and status change.
   - **Form Validation**: Immediate inline error feedback on title length (min 3 chars, max 100), required status, priority, and date.
   - **Empty States**: Contextual empty states for zero tasks, zero search results, and zero filter matches.
   - **Restore Sample Data**: Reset button to quickly restore 8 realistic workplace sample tasks.

6. **Responsive & Modern Design**:
   - Dark professional sidebar (`#0f172a`) + clean off-white workspace (`#f8fafc`).
   - Mobile navigation drawer with backdrop on tablet and mobile viewports.
   - Tested across desktop (1440px), laptop (1024px), tablet (768px), and mobile (390px).

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional Components, Custom Hooks)
- **Build Tool**: Vite 8
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS (Tailored Design System in `src/index.css`)
- **Icons**: `lucide-react`
- **Data Persistence**: Browser `localStorage` (Key: `gupio_tasks`)
- **Linter**: Oxlint

---

## 💾 LocalStorage Persistence Layer

All task data is stored in the browser's `localStorage` under the single key:
```
gupio_tasks
```

### Persistence Workflow:
1. **Application Startup (`src/utils/storage.js`)**:
   - Checks `localStorage.getItem('gupio_tasks')`.
   - If empty, null, or corrupted, the app automatically initializes with **8 realistic workplace tasks** (e.g. "Prepare weekly project report", "Complete UI accessibility audit", "Review employee onboarding checklist").
   - Relative date offsets are used so test criteria (Overdue, Due Today, Upcoming) work reliably on any day.
2. **State Synchronization (`src/hooks/useTasks.js`)**:
   - Any create, edit, delete, or status update synchronously commits back to `localStorage`.
   - Corrupted or invalid JSON data in storage is caught gracefully with automatic fallback.
3. **Reset Capability**:
   - A "Reset Sample Tasks" option in the sidebar and empty state lets interviewers quickly restore initial state at any time.

---

## 📂 Project Structure

```
gupio-fe/
├── index.html                  # HTML entry point with Plus Jakarta Sans & SEO meta
├── package.json                # Project dependencies and npm scripts
├── src/
│   ├── App.jsx                 # Main application layout and modal orchestrator
│   ├── main.jsx                # React root mount
│   ├── index.css               # Comprehensive SaaS design system & responsive styling
│   ├── components/
│   │   ├── Sidebar.jsx         # Dark navigation sidebar & storage status
│   │   ├── Header.jsx          # Top bar with page title, date badge, & Add Task CTA
│   │   ├── StatCard.jsx        # Dynamic metric cards with interactive drill-down
│   │   ├── SearchFilterBar.jsx # Real-time search, status tabs, sort & view toggle
│   │   ├── TaskList.jsx        # Container switching between Grid and Table views
│   │   ├── TaskCard.jsx        # Modern task card with quick complete and badges
│   │   ├── TaskTableView.jsx   # Dense productivity table view
│   │   ├── TaskForm.jsx        # Reusable modal form for Create and Edit
│   │   ├── TaskDetails.jsx     # Detail inspector modal with timestamps
│   │   ├── ConfirmDialog.jsx   # Safe confirmation modal for deletion and reset
│   │   ├── Toast.jsx           # Floating notification toast system
│   │   └── EmptyState.jsx      # Contextual empty state illustrations
│   ├── hooks/
│   │   ├── useTasks.js         # Custom hook managing task state, CRUD, and stats
│   │   └── useToast.js         # Custom hook for toast notifications
│   └── utils/
│       ├── storage.js          # Resilient localStorage read/write with sample data
│       ├── taskUtils.js        # Date calculations, metrics, filter/sort, validation
│       └── testVerification.js # Automated verification test suite
```

---

## 🏃 How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Step 1: Clone or Navigate to the Directory
```bash
cd "gupio fe"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### Step 4: Run Automated Tests
```bash
npm run test
```

### Step 5: Run Production Build
```bash
npm run build
```

---

## 📋 Task Data Model

```json
{
  "id": "task-1718000000000-abc12",
  "title": "Complete UI accessibility audit",
  "description": "Audit color contrast ratios, ARIA labels, and keyboard tab sequences across all main modals.",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2026-10-05",
  "createdAt": "2026-10-02T10:30:00.000Z",
  "updatedAt": "2026-10-04T15:20:00.000Z"
}
```

---

## ✅ Completed Checklist Verification

- [x] **1. Create tasks**: Reusable form modal with validation.
- [x] **2. List tasks**: Grid and Table views.
- [x] **3. View task details**: Full properties, timestamps, status changer.
- [x] **4. Edit tasks**: Pre-populated reusable form with timestamp tracking.
- [x] **5. Delete tasks**: Two-step confirmation modal with notifications.
- [x] **6. Manage task status**: `Todo`, `In Progress`, `Completed`.
- [x] **7. Manage task priority**: `Low`, `Medium`, `High`.
- [x] **8. Manage due date**: Date input with Today/Tomorrow shortcuts.
- [x] **9. Search tasks**: Real-time search across title and description.
- [x] **10. Filter by status**: Tabs and dropdown filters including Overdue and Due Today.
- [x] **11. Useful task statistics**: 5 dynamic stat cards with click-to-filter.
- [x] **12. Responsive interface**: Desktop (1440px), Laptop (1024px), Tablet (768px), Mobile (390px).
- [x] **13. Clear form validation**: Title min 3 chars, required fields, date format checks.
- [x] **14. Clear error feedback**: Inline form error messages and toast alerts.
- [x] **15. Overdue / Due Today indicators**: Prominently styled alert badges.
- [x] **16. LocalStorage persistence**: Clean key `gupio_tasks` with realistic initial workplace sample tasks.
- [x] **17. Zero console / lint errors**: Clean code verified with `oxlint` and automated test suite.

---

## 💡 Assumptions & Design Choices

1. **No External Backend**: Pure frontend application storing all records in browser `localStorage`.
2. **Initial Sample Tasks**: Initialized with 8 realistic corporate workplace tasks rather than dummy text ("Lorem ipsum") so the application looks production-ready immediately upon opening.
3. **Dynamic Date Offsets**: Sample task dates are generated relative to current date (e.g. yesterday, today, +3 days) to guarantee that "Overdue" and "Due Today" test cases render actively regardless of what day the recruiter reviews the project.
4. **Modal vs In-line Editing**: Used clean dialogs with escape-key and click-outside dismissal to maximize mobile responsiveness and keep the primary table/card view clean.
