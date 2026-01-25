
# Gastro-Vibe Architecture & State Map

## 1. Core Concept
Gastro-Vibe is a hybrid Web App (PWA) combining:
1.  **Digital Menu:** Dynamic content, filtering, search.
2.  **Order System:** Real-time cart, modifiers, bill splitting.
3.  **Gamification:** XP system, levels, mini-games (Roulette, Quiz).
4.  **Admin Panel:** Content management (CMS).

## 2. File Structure & Responsibility

### Root
- `App.tsx`: Main router/switch for screens. Handles high-level transitions.
- `types.ts`: TypeScript definitions for DB schema and UI state.
- `constants.ts`: Mock data (fallbacks) and configuration constants.

### Store (`/store`)
- `GameContext.tsx`: **The Monolith State Manager.**
  - **Responsibility:** Holds ALL app state (User, Session, Menu, Cart, UI flags).
  - **Critical Warning:** Any change here triggers re-renders across the app.
  - **Data Source:** Fetches from Supabase, falls back to `constants.ts`.

### Components
- `/Screens`: Full-page views (Menu, Table, Bill, Profile, Admin, Settings, Debug).
- `/Modals`: Overlays (ProductSheet, StoryViewer, CollectionSelector).
- `/Layout`: Persistent UI (BottomNav, BurgerMenu).

## 3. Critical Logic Flows

### A. Price Calculation (The Money Logic)
**Formula:** `(BasePrice + Σ ModifierPrices) * Quantity`
- **Location:** `components/Modals/ProductSheet.tsx` (Visual calculation) & `store/GameContext.tsx` (Final order creation).
- **Risk:** Discrepancy between the Sheet calculation and the Cart item price.
- **Validation:** `utils/healthCheck.ts` -> `testCartMath()`.

### B. Modifiers System (Current vs Target)
- **Current (Legacy):** Modifiers are JSON arrays *inside* the Dish object.
  - *Pros:* Simple to read.
  - *Cons:* Hard to update globally (e.g., change milk price everywhere).
- **Target (Admin Update):** Relational DB.
  - Tables: `modifier_groups` -> `modifiers` -> `dish_modifiers_link`.

### C. Data Loading Strategy
1. App Init -> `GameContext.useEffect`.
2. Check Auth (Anon/User).
3. Fetch `categories` (Supabase).
4. Fetch `dishes` (Supabase).
   - *Logic:* If DB is empty or fails, use `DEFAULT_MENU_ITEMS` from constants.
   - *Logic:* Merge DB fields with local hardcoded helpers if needed.

## 4. State Map (Where is it?)

| State | Location | Persistence |
|-------|----------|-------------|
| **Cart** | `GameContext.orderItems` | RAM (Lost on refresh currently) |
| **User** | `GameContext.userProfile` | Supabase `profiles` + Local State |
| **Menu** | `GameContext.menuItems` | Supabase `dishes` |
| **Tab** | `GameContext.activeTab` | Local State |
| **Theme** | `GameContext.theme` | Local Storage (via logic) |

## 5. Admin Panel Architecture
The Admin Panel is a sub-app accessed via `activeTab === 'admin'`.
- **Read:** Direct Supabase queries.
- **Write:** Direct Supabase mutations.
- **Sync:** Must invalidate `GameContext` data to reflect changes in the Guest View.

## 6. Known Technical Debt
1. **Context Performance:** `GameContext` is too large. Needs splitting into `DataContext` and `UIContext`.
2. **Hardcoded IDs:** `constants.ts` relies on string IDs. DB migration must preserve these slugs.
3. **Styles:** Tailwind config uses some custom fonts that must be loaded in `index.html`.
