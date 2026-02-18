# 🤖 AI Agent Guide: Fabrico Template

> **Context for AI**: This document describes the architectural patterns, styling engine, and modification rules for this Expo/React Native codebase. Use this to understand how to safely modify the application.

---

## 1. Core Architecture

- **Framework**: Expo SDK 54 (Managed Workflow)
- **Engine**: React Native 0.81 (New Architecture enabled)
- **Routing**: Expo Router v6 (File-system based in `app/`)
- **Styling**: NativeWind v4 (Tailwind CSS interface)
- **State**: Zustand (global), React Context (providers)
- **Validation**: Zod + React Hook Form
- **Code Quality**: Biome (Lint/Format), TypeScript (Strict)

### Directory Structure Map
- `app/` → **Routing Root**. Files here become screens. `_layout.tsx` files handle navigation wrappers.
- `components/ui/` → **Design System**. Styled, reusable components. **Edit these** to change app appearance.
- `components/primitives/` → **Logic Core**. Headless, accessible primitives (based on Radix UI patterns). **Avoid editing** unless changing fundamental behavior.
- `lib/` → **Utilities**. Helper functions (`cn`, `storage`).
- `global.css` → **Theme Source**. Defines styling variables.

---

## 2. Theming System (NativeWind)

The application uses a CSS-variable based theme system compatible with NativeWind.

### Source of Truth: `app/global.css`
The theme is defined in the `:root` pseudo-class. Colors are stored as **HSL triplets** (Hue Saturation Lightness) *without* the `hsl()` wrapper.

**Example Definition:**
```css
:root {
  --primary: 240 5.9% 10%; /* Blue-black */
  --destructive: 0 84.2% 60.2%; /* Red */
}
```

### How to Update Color Palette
To change the app's color scheme, you must modify `app/global.css`.

1.  **Read** `app/global.css`.
2.  **Update** the HSL values in `:root`.
    *   *Input*: `240 5.9% 10%`
    *   *Output*: Your new HSL values.
3.  **Do NOT** wrap values in `hsl()`. Tailwind applies the wrapper automatically via `tailwind.config.ts`.

### Semantic Tokens
Use these tokens in Tailwind classes (e.g., `bg-primary`, `text-muted-foreground`).

| Variable | Tailwind Class | Usage |
| :--- | :--- | :--- |
| `--background` | `bg-background` | Page/Container backgrounds |
| `--foreground` | `text-foreground` | Default text color |
| `--primary` | `bg-primary` | Main actions (buttons, active states) |
| `--secondary` | `bg-secondary` | Secondary actions, less prominent bg |
| `--muted` | `bg-muted` | Disabled states, subtle backgrounds |
| `--accent` | `bg-accent` | Hover states, highlights |
| `--destructive` | `bg-destructive` | Error states, delete actions |
| `--border` | `border-border` | Default border color |
| `--input` | `border-input` | Form input borders |
| `--ring` | `ring-ring` | Focus rings |

### Adding New Colors
1.  Define variable in `app/global.css`: `--brand-new: 120 50% 50%;`
2.  Register in `tailwind.config.ts` under `theme.extend.colors`:
    ```ts
    "brand-new": "hsl(var(--brand-new))",
    ```

---

## 3. Component Usage patterns

### Modifying UI
When asked to "change the button style" or "input look":
- **Target**: `components/ui/*.tsx` (e.g., `components/ui/button.tsx`).
- **Method**: Edit the `className` strings in the `cva()` variant definitions.
- **Utility**: Always use `cn()` for merging classes.

### Creating New Screens
1.  Create `.tsx` file in `app/`.
2.  Export default function.
3.  Use `<View className="flex-1 bg-background">` as wrapper.

---

## 4. Feature Architecture (Best Practice)

To scale the app without "spaghetti code", use a **Feature-First** modular organization for new business logic.

### 🚫 The "Spaghetti" Way (Avoid)
- putting all components in `components/`
- putting all hooks in `hooks/`
- putting massive logic inside `app/screen.tsx`

### ✅ The Modular Way (Recommended)
Create a `modules/` directory for distinct domains (e.g., `Auth`, `Profile`, `Feed`).

**Structure Pattern:**
```text
modules/authentication/
├── components/          # Feature-specific UI (LoginForm.tsx, SocialButton.tsx)
├── hooks/               # Business logic (useLogin.ts, useSession.ts)
├── services/            # API calls (authService.ts)
├── schemas/             # Zod validation (loginSchema.ts)
└── index.ts             # Public API (export { LoginForm } from './components/...')
```

**Integration Rule:**
The files in `app/` (Expo Router) should be **thin wrappers**.
```tsx
// app/login.tsx
import { LoginForm } from '@/features/authentication';

export default function LoginRoute() {
  return (
    <View className="flex-1 bg-background justify-center">
       <LoginForm />
    </View>
  );
}
```

---

## 5. External Services & Database

Keep external dependencies isolated to allow for easy mocking and swapping.

- **Location**: `lib/services/` or `lib/api/`
- **Pattern**: Singleton classes or exported functions.

**Example:**
```ts
// lib/services/database.ts
import { createClient } from '@supabase/supabase-js';

// Initialize ONCE
export const supabase = createClient(ENV.url, ENV.key);

// lib/services/user-api.ts
import { supabase } from './database';

export const UserAPI = {
  getUser: async (id: string) => { ... },
  updateUser: async (data: User) => { ... }
};
```

**Instruction for AI**: If asked to "add a database", create the client in `lib/services/` and consume it inside a hook in `features/[feature]/hooks/`.

---

## 6. Rapid Codebase Understanding

To quickly understand this project as an AI agent:

1.  **Navigation Hierarchy**: generic `app/_layout.tsx` (Global Providers) -> `app/(tabs)/_layout.tsx` (Main Tab Bar) -> Individual screens.
2.  **Capabilities**: Check `package.json`.
    *   `expo-router` = File-system routing.
    *   `nativewind` = Tailwind styling.
    *   `zod` = Schema validation.
3.  **UI Building Blocks**: Check `components/ui/index.ts` to see what Lego blocks are available (Button, Card, Input).

**Golden Rules for Modification:**
1.  **Extend, Don't Rewrite**: Use existing UI primitives (`components/ui`).
2.  **Isolate Logic**: Put complex logic in `features/` or `hooks/`, not in `app/` screens.
3.  **Safe Styling**: Never use `StyleSheet` for layout if Tailwind (`className`) can do it.
4.  **Consistency**: Follow the existing pattern of `interface Props` and `export function`.
