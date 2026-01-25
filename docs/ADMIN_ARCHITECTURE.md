
# Gastro-Vibe: Admin Module Architecture (v2.1 Implemented)

**Status:** Live / Demo Ready
**Module:** Admin Panel (Host, Kitchen, Waiter)

---

## 1. Core Logic: Table Lifecycle
The application now tracks granular states of a table, driving the specific UI for each role.

| State | Visual Indicator | Meaning | Trigger |
|-------|------------------|---------|---------|
| `free` | Green Border | Table empty. | Auto after cleaning. |
| `seated` | Blue Border | Guests just sat down (Walk-in or Reserved). | Host: "Walk-in" button. |
| `ordered` | Orange Border | Order placed, waiting for food. | Waiter: Taking order. |
| `eating` | Red Border | Food served. Guests are dining. | Kitchen: "Ready" -> Waiter: "Served". |
| `paying` | Green Pulse | Guests asked for bill. | Waiter: "Request Payment". |
| `cleaning` | Gray/Dimmed | Guests left, table needs cleaning. | Waiter: "Close Check". |
| `reserved` | Dashed Purple | Upcoming reservation (<45m). | Auto based on time. |

---

## 2. Role-Specific Implementation

### A. Host (Hall Control)
*   **View:** Interactive Map with Drag-to-scroll Timeline (Gantt).
*   **Key Features:**
    *   **Visual Map:** Real-time status colors, "Ghost" reservation tags.
    *   **Timeline Sidebar:** Gantt chart showing reservations per table (12:00 - 24:00).
    *   **New Reservation:** Modal with visual conflict detection (red blocks on timeline).
    *   **Walk-in:** Immediate seating logic for free tables.

### B. Kitchen (KDS System)
*   **View:** Ticket Board + Aggregation Sidebar.
*   **Key Features:**
    *   **All-Day Counter:** Sidebar showing total count of specific items needed (e.g., "Burgers: 12").
    *   **Course Separation:** Tickets visually split into Starters / Mains / Desserts.
    *   **Station Filtering:** Toggle between "Kitchen", "Bar", or "All".
    *   **Timers:** Color-coded headers (Green -> Yellow -> Red) based on elapsed time.

### C. Waiter (Mobile Terminal)
*   **View:** Priority Grid.
*   **Key Features:**
    *   **Priority Sorting:** Tables with `Alert` (Payment/Call) or `Ready Food` appear first.
    *   **Actionable Cards:** 
        *   `Fire Mains`: Signal kitchen to start hot course.
        *   `Payment`: Open Loyalty/Splitting modal.
    *   **Notifications:** "Kitchen Ready" alerts at the top.

---

## 3. Data Flow (Mock -> State)
*   Currently uses `MOCK_FLOOR_PLAN` and `MOCK_KITCHEN_TICKETS` in `constants.ts`.
*   `AdminScreen.tsx` manages the local state overlay on top of mocks to simulate interactivity (Walk-in -> Eating -> Paying cycle) without a real backend for the demo.
