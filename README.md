# Gupio TaskHub — Task Management Dashboard

**Project:** Gupio TaskHub  
**Subtitle:** Modern SaaS Productivity & Task Management Dashboard  
**Assignment:** Gupio Campus Placement Development Assignment — Frontend Developer (Option 1: Task Management Dashboard)  
**Live Demo:** [https://gupio-taskhub.vercel.app](https://gupio-taskhub.vercel.app)  

> **Important Security & Architecture Notice:**  
> **"This is a frontend-only implementation using localStorage. Authentication is a demonstration feature and does not provide production-grade security."**

---

## 🌟 Overview

**Gupio TaskHub** is a high-performance, SaaS-grade productivity and task management web application built with **React**, **Vite**, and **localStorage**. Designed with modern product aesthetics, it provides complete task organization, multi-view boards (Grid, Table, Kanban Drag-and-Drop, Calendar), real-time analytics, user profiles, light/dark themes, in-app notifications, and instant data exports.

All data is managed locally on the client and scoped to the logged-in user with zero external backend dependencies.

---

## 🚀 Comprehensive Feature Suite

### 1. 🔐 Frontend Authentication UI & Data Isolation
- **Route Protection**: Unauthenticated visits to `/dashboard`, `/tasks`, `/board`, `/calendar`, `/analytics`, `/profile`, or `/settings` redirect to `/login`. Authenticated visits to `/login` or `/signup` automatically redirect to `/dashboard`.
- **Sign In (`/login`)**:
  - Email & password validation.
  - Password visibility toggle (Show/Hide).
  - "Remember me" toggle and Demo Credential autofill button.
  - Informative error handling and loading feedback.
- **Sign Up (`/signup`)**:
  - Full name, email, password, and password confirmation with matching validation.
  - Real-time password strength meter (Weak / Medium / Strong).
  - Terms acceptance checkbox.
  - Instant account creation, automatic login, and redirect.
- **Demo Credentials Provided**:
  - **Email**: `alex.morgan@gupio.dev`
  - **Password**: `password123`
- **Multi-User Data Ownership**:
  - Each task is tagged with a `userId`. Users only view and manage their own tasks.
  - Switching accounts isolates and preserves task states across user sessions.

### 2. 📋 Core Task CRUD & Productivity Attributes
- **Task Creation**: Modal dialog with input validation, title, detailed description, status, priority, and date picker.
- **Task Listing**: Toggle between high-density **Table View** and visual **Grid Cards**.
- **Task Inspection**: Task detail modal featuring a stepped visual progress indicator (`Todo` ➔ `In Progress` ➔ `Completed`), timestamps, and direct actions.
- **Task Editing**: Instant modification with validation and `updatedAt` tracking.
- **Safe Deletion**: Two-step confirmation modal with contextual warnings.
- **Status Progression**: `Todo`, `In Progress`, `Completed`.
- **Priority Levels**: `Low`, `Medium`, and `High` with color-coded badges.
- **Date Intelligence**:
  - 🔴 **Overdue Indicator**: Highlights tasks past their due date that are not yet marked completed.
  - 🟣 **Due Today Indicator**: Highlights tasks due on the current calendar day.
  - ⚡ **Quick Complete Toggle**: One-click checkmark toggle directly from cards, table rows, and boards.

### 3. 📊 Interactive Kanban Sprint Board (`/board`)
- Three status columns: **TODO**, **IN PROGRESS**, and **COMPLETED**.
- Native HTML5 Drag-and-Drop between columns with visual drop target highlights.
- Immediate synchronization: dragging a task updates React state, `localStorage`, dashboard metrics, and analytics.
- Task counts per column, overdue pills, priority badges, and empty column states.

### 4. 📅 Task Calendar View (`/calendar`)
- Monthly 6×7 calendar grid mapping tasks directly to their due dates.
- Previous month, next month, and quick "Today" navigation.
- Overdue styling, completed strikethrough, and priority dot indicators.
- Clicking any task inside a calendar cell immediately opens the Task Details modal.

### 5. 📈 Analytics & Velocity Dashboard (`/analytics`)
- **Key Metrics**: Total Tasks, Completed, In Progress, Todo, Overdue, High Priority, and Completion Rate %.
- **Dynamic Charts**:
  - **Tasks by Status**: Donut breakdown with percentage metrics.
  - **Tasks by Priority**: Distribution bars (High / Medium / Low).
  - **7-Day Velocity**: Daily completion trajectory chart.
  - **Upcoming Deadlines**: Day-by-day deadline projection for the next 7 days.
- **Productivity Summary Text**: Generated dynamically based on active task backlog velocity.

### 6. 🧠 Smart Dashboard (`/dashboard`)
- Comprehensive overview cards with click-to-filter drill-down.
- **Today's Focus**: Filtered view of tasks due today and high-priority items.
- **Upcoming Deadlines**: Quick-glance list for the upcoming 7 days.
- **Overdue Action Center**: Urgent warning section for overdue tasks with one-click resolution.
- **Recently Completed**: Feed displaying latest completed milestones.

### 7. 🔔 Notification Center
- Header notification bell with unread badge counter.
- Automatic scanning for overdue tasks and tasks due today on workspace load.
- Dropdown panel with "Mark as Read", "Mark All as Read", and "Clear All" actions.
- Notification state persisted in `localStorage` without spamming on re-renders.

### 8. 🌓 Dark / Light Theme System
- Seamless theme switching persisted in `localStorage` (`gupio_theme`).
- Custom dark palette engineered with deep slate tones (`#0f172a`, `#1e293b`), high-contrast typography, and accessible borders (no harsh pure blacks).
- Toggled via the header Sun/Moon button or the Settings page.

### 9. 👤 User Profile (`/profile`)
- User avatar with initials and selectable accent colors.
- Editable user display name with instant persistence.
- Lifetime productivity stats: total tasks, completed, in progress, and completion rate.
- One-click logout button.

### 10. ⚙️ Workspace Settings (`/settings`)
- **Appearance**: Light / Dark theme selector cards.
- **Preferences**: Default task view mode selection (Grid / Table).
- **Data Management**: Quick export to CSV and JSON.
- **Danger Zone**: Guarded "Clear All Tasks" and "Reset Sample Tasks" actions with confirmation dialogs.

### 11. 📤 Data Export
- **Export to CSV**: Formatted spreadsheet file containing Title, Description, Status, Priority, Due Date, Created Date, and Updated Date.
- **Export to JSON**: Complete structured data dump of task records.
- Export triggered via the header, Settings page, or task controls modal with toast feedback.

### 12. 🔍 Global Search & Advanced Filters
- **Global Search**: Instant search across Title, Description, Status, and Priority.
- **Keyboard Shortcut**: Press `Ctrl + K` (or `Cmd + K`) anywhere to focus search.
- **Active Filter Counter**: Displays badge such as `Filters (3)` with a one-click "Clear Filters" button.

---

## 🛠️ Technologies Used

- **Framework**: React 19 (Functional Components, Hooks, Context API)
- **Build Tool**: Vite 8 (Hot Module Replacement, lightning-fast builds)
- **Language**: JavaScript (ES6+ Modules)
- **Styling**: Tailored Vanilla CSS Design System (`src/index.css`)
- **Icons**: `lucide-react`
- **Routing**: Zero-dependency Client-side Router via HTML5 History API (`pushState` / `popstate`)
- **Storage**: Browser `localStorage` (Isolated keys: `gupio_tasks`, `gupio_users`, `gupio_current_user`, `gupio_theme`, `gupio_notifications`, `gupio_preferences`)
- **Quality & Linting**: Oxlint

---

## 💾 LocalStorage Data Architecture

Data is structured cleanly across isolated local keys:

| Key | Purpose |
|---|---|
| `gupio_tasks` | Master task store array, filtered per `userId` |
| `gupio_users` | Registered users array (`id`, `name`, `email`, `password`, `avatarColor`, `createdAt`) |
| `gupio_current_user` | Currently authenticated user session |
| `gupio_theme` | Active theme (`light` or `dark`) |
| `gupio_notifications` | Notification logs with read/unread statuses |
| `gupio_preferences` | User view defaults (e.g. `defaultView: 'grid'`) |

---

## 📂 Project Structure

```
gupio fe/
├── index.html                     # HTML root with typography & meta
├── package.json                   # Scripts, dependencies, and metadata
├── vite.config.js                 # Vite bundler configuration
├── src/
│   ├── App.jsx                    # Root app component and router view switch
│   ├── main.jsx                   # React 19 DOM root mount
│   ├── index.css                  # CSS design system (tokens, themes, components)
│   ├── context/
│   │   ├── AuthContext.jsx        # Demo authentication, session & multi-user state
│   │   ├── RouterContext.jsx      # Zero-dependency browser router & route guard
│   │   ├── ThemeContext.jsx       # Theme state & HTML document attribute injector
│   │   └── NotificationContext.jsx# Notification bell state & event scanner
│   ├── hooks/
│   │   ├── useTasks.js            # Task state management, CRUD, & status transition
│   │   └── useToast.js            # Floating alert banner hook
│   ├── pages/
│   │   ├── LoginPage.jsx          # Split-screen auth card with demo login credentials
│   │   ├── SignupPage.jsx         # Sign up form with password strength gauge
│   │   ├── DashboardPage.jsx      # Metric cards + Smart Dashboard widgets
│   │   ├── TasksPage.jsx          # Dedicated task list with grid/table views
│   │   ├── KanbanBoardPage.jsx    # Native drag-and-drop sprint board
│   │   ├── CalendarViewPage.jsx   # Monthly calendar mapping tasks by due date
│   │   ├── AnalyticsPage.jsx      # SVG Donut charts, velocity & deadline graphs
│   │   ├── ProfilePage.jsx        # Profile editor, color picker, and lifetime stats
│   │   └── SettingsPage.jsx       # Theme, preferences, export, & danger zone
│   ├── components/
│   │   ├── Header.jsx             # Search bar (Ctrl+K), notifications, theme, user menu
│   │   ├── Sidebar.jsx            # SaaS navigation drawer with route links
│   │   ├── StatCard.jsx           # Click-to-filter summary metric cards
│   │   ├── SearchFilterBar.jsx    # Search input, status tabs, sort, view toggle & badges
│   │   ├── TaskList.jsx           # Responsive Grid / Table wrapper
│   │   ├── TaskCard.jsx           # Interactive task card with quick-complete toggle
│   │   ├── TaskTableView.jsx      # Dense data table view
│   │   ├── TaskForm.jsx           # Reusable Create / Edit modal with validation
│   │   ├── TaskDetails.jsx        # Stepped progression inspector modal
│   │   ├── ExportModal.jsx        # CSV / JSON download dialog
│   │   ├── NotificationDropdown.jsx # Notification center overlay
│   │   ├── UserDropdown.jsx       # User profile popup menu
│   │   ├── ConfirmDialog.jsx      # Confirmation modal for destructive actions
│   │   ├── Toast.jsx              # Feedback toast notifications
│   │   └── EmptyState.jsx         # Contextual empty state illustrations
│   └── utils/
│       ├── storage.js             # LocalStorage helpers, seeding, CSV/JSON exports
│       ├── taskUtils.js           # Filtering, sorting, deadline calculations, validation
│       └── testVerification.js    # 27-point automated test verification suite
```

---

## 🏃 Installation & Local Execution

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)

### 1. Clone the Repository
```bash
git clone https://github.com/chalanasuresh/Gupio-TaskHub.git
cd Gupio-TaskHub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Executes the 27-point verification suite covering CRUD, filters, metrics, and validation.

### 5. Build for Production
```bash
npm run build
```
Creates an optimized production bundle inside `dist/`.

---

## 🧪 Testing Checklist

| Area | Test Steps | Expected Result |
|---|---|---|
| **Auth** | Sign up with new email & login with demo credentials | Successfully redirects to dashboard with isolated user data |
| **Tasks** | Create, edit, delete, mark completed | Tasks update across all views and sync to `localStorage` |
| **Kanban** | Drag card from `TODO` to `IN PROGRESS` | Card moves smoothly, status updates, metrics refresh |
| **Calendar** | Navigate months and click a task date pill | Task detail inspector modal opens |
| **Analytics** | View charts and complete a task | Velocity, status donut, and completion rate update dynamically |
| **Theme** | Toggle Sun/Moon icon | Switches between Light and Dark mode; persists on page reload |
| **Export** | Click Export CSV or JSON | Triggers instant browser download and displays toast |
| **Shortcuts** | Press `Ctrl + K` (or `Cmd + K`) | Global search input receives immediate focus |

---

## 💡 Assumptions & Design Choices

1. **Client-Side Demonstration**: The assignment specifies a frontend-only task dashboard. `localStorage` is used for authentication sessions, data persistence, and preferences.
2. **Dynamic Relative Dates**: Sample workplace tasks dynamically use date offsets relative to today so that "Overdue" and "Due Today" test cases are always active and verifiable on any day.
3. **Responsive Viewport Target**: Designed and tested across 1440px, 1280px, 1024px, 768px, 390px, and 375px viewports.
4. **Accessible Design**: Clean dark mode with balanced slate contrasts, legible typography via Google Fonts (Inter / Plus Jakarta Sans), and clear interactive feedback.

---

## 📜 License
Developed for the **Gupio Campus Placement Development Assignment — Frontend Developer (Option 1: Task Management Dashboard)**. All rights reserved.
