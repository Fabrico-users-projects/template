# ✨ Fabrico Template

> A production-ready React Native starter template for building beautiful cross-platform apps

**Build iOS, Android, and Web apps with a modern, type-safe stack.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-54-black)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

---

## 🎯 Philosophy

Fabrico embraces **modern React Native development**:
- 🚀 **Zero configuration** - Works immediately out of the box
- 📱 **Cross-platform native** - iOS, Android, and Web from one codebase
- 🎨 **Beautiful by default** - 50+ production-ready UI components
- 🔒 **Type-safe everything** - End-to-end TypeScript with strict mode
- ⚡ **Fast development** - Hot reload, file-based routing, Tailwind CSS

---

## 📚 What's Inside

### Core Stack
- ⚡ **[Expo v54](https://expo.dev)** - Latest Expo SDK with New Architecture
- ⚛️ **[React 19.1.0](https://react.dev)** - Latest React with React Native 0.81.5
- 🔷 **[TypeScript 5.9](https://www.typescriptlang.org/)** - Strict mode enabled, all errors resolved
- 🗺️ **[Expo Router v6](https://docs.expo.dev/router)** - File-based routing with typed routes

### UI & Styling
- 💎 **[NativeWind v4](https://www.nativewind.dev)** - Tailwind CSS for React Native
- 🎨 **50+ UI Components** - Cross-platform primitives + styled components
- ☀️ **Light Mode Only** - Simplified theme system (Dark mode removed for consistency)
- ♿ **Accessible** - WCAG compliant with ARIA support

### Forms & Validation
- 📝 **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- ✅ **[Zod](https://zod.dev/)** - Runtime validation with TypeScript inference
- 🎯 **Form Components** - Pre-built FormInput, FormSelect, FormCheckbox, etc.

### State & Storage
- 🐻 **[Zustand](https://zustand-demo.pmnd.rs/)** - Minimal state management
- 🎭 **React Context** - Theme providers
- 💾 **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Persistent storage (iOS, Android, Web)

### Developer Experience
- 📏 **[Biome](https://biomejs.dev/)** - Fast linting and formatting (ESLint + Prettier replacement)
- 🔍 **Path Aliases** - Clean imports with `@/` prefix
- 🗂️ **VSCode Integration** - Recommended extensions and settings
- 🔄 **Hot Reload** - Instant feedback on all platforms

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** and **Bun** (or npm)
- **[iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)** (macOS only)
- **[Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)** (for Android development)
- **Windows users:** [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)

### Installation

```bash
# Clone the repository
git clone https://github.com/oularefodos/Fabrico-Template.git
cd Fabrico-Template

# Install dependencies
bun install
# or
npm install

# Start development server
bun dev
# or
npm run dev
```

### Platform-Specific Commands

```bash
# iOS (macOS only)
bun dev:ios

# Android
bun dev:android

# Web
bun dev
# Then press 'w' in the terminal
```

---

## 🏗️ Project Structure

```
fabrico-template/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Landing page
│   │   └── _layout.tsx      # Tab configuration
│   ├── _layout.tsx          # Root layout with providers
│   ├── +not-found.tsx       # 404 screen
│   └── global.css           # Tailwind theme variables
│
├── components/              # React components
│   ├── ui/                  # 28 styled components (Button, Card, Form, etc.)
│   ├── primitives/          # 14 cross-platform primitives (Checkbox, Dialog, etc.)
│   ├── Icons.tsx            # Lucide icons configuration
│   └── ThemeToggle.tsx      # Theme switcher component
│
├── lib/                     # Utilities
│   ├── icons/               # Custom icon components
│   ├── utils.ts             # cn() utility (clsx + tailwind-merge)
│   ├── storage.ts           # AsyncStorage wrapper
│   └── useColorScheme.tsx   # Theme hook
│
├── hooks/                   # React hooks
├── assets/                  # Images, fonts, etc.
└── public/                  # Web static assets
```

---

## 🎨 UI Components

All components support dark/light mode, are fully typed, and work across iOS, Android, and Web.

### Available Components

#### Form Components
```tsx
import {
  Button, Input, Textarea, Checkbox, Switch,
  RadioGroup, Select, Combobox,
  Form, FormField, FormInput, FormSelect
} from '@/components/ui';

// Example: Form with validation
<Form>
  <FormInput
    label="Email"
    name="email"
    type="email"
    validation={z.string().email()}
  />
  <FormSelect
    label="Country"
    name="country"
    options={countries}
  />
  <Button type="submit">Submit</Button>
</Form>
```

#### Display Components
```tsx
import {
  Card, CardHeader, CardTitle, CardContent,
  Badge, Avatar, Progress, Skeleton,
  AlertDialog, Dialog, DropdownMenu
} from '@/components/ui';

// Example: Card
<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <Text>Card content here</Text>
  </CardContent>
</Card>
```

#### Layout Components
```tsx
import {
  List, ListItem, Separator,
  Text, H1, H2, H3, Muted
} from '@/components/ui';

// Example: List
<List>
  <ListItem label="Item 1" onPress={() => {}} />
  <ListItem label="Item 2" detail />
</List>
```

### Styling with NativeWind

```tsx
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View className="bg-background p-4 rounded-lg shadow-sm">
      <Text className="text-foreground text-lg font-semibold">
        Hello Fabrico!
      </Text>
      <Text className="text-muted-foreground text-sm">
        Tailwind CSS works on React Native
      </Text>
    </View>
  );
}
```

### Theme Colors

All colors are defined in `app/global.css` using CSS variables:

```css
/* Light mode */
--background: 0 0% 100%
--foreground: 240 10% 3.9%
--primary: 240 5.9% 10%
--secondary: 240 4.8% 95.9%
--destructive: 0 84.2% 60.2%
--muted: 240 4.8% 95.9%
--accent: 240 4.8% 95.9%

**Usage:**
```tsx
<View className="bg-background text-foreground">
<Button className="bg-primary">Primary Button</Button>
<Text className="text-destructive">Error message</Text>
```

---

## 🛠️ Development Guide

### Adding a New Screen

1. **Create file** in `app/`:
```tsx
// app/profile.tsx
export default function Profile() {
  return (
    <View className="flex-1 p-4">
      <Text>Profile Screen</Text>
    </View>
  );
}
```

2. **Navigate** to it:
```tsx
import { Link } from 'expo-router';

<Link href="/profile">Go to Profile</Link>
```

### Form Validation

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormInput {...field} label="Email" />
      )}
    />
  );
}
```



### Persistent Storage

```tsx
import { getItem, setItem, removeItem } from '@/lib/storage';

// Store (async)
await setItem('user.name', 'John Doe');

// Retrieve (async)
const name = await getItem<string>('user.name');

// Delete (async)
await removeItem('user.name');
```

---

## 📦 Available Scripts

```bash
# Development
bun dev              # Start Expo dev server
bun dev:android      # Start Android with cache clear
bun ios              # Build & run iOS
bun android          # Build & run Android

# Build
bun build:web        # Build static web export

# Code Quality
bun format           # Format code with Biome
bun expo-check       # Check Expo dependency versions

# Testing
bun test             # Run unit tests (Jest)
```

---

## 🔮 Roadmap

### Planned Features
- [ ] **Enhanced UI**
  - Additional component examples
  - More form patterns
  - Animation examples

- [ ] **Additional Features**
  - i18n support (multi-language)
  - Example CRUD screens
  - State management examples

- [x] **Developer Tools**
  - [x] Testing setup (Jest + React Native Testing Library)
  - [x] CI/CD (GitHub Actions)
  - [ ] E2E testing (Detox)
  - Storybook for components
  - Component documentation

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Improve documentation
- Share feedback

---

## 📝 License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev) - Cross-platform framework
- [NativeWind](https://www.nativewind.dev) - Tailwind for React Native
- [Radix UI](https://www.radix-ui.com) - Accessible primitives
- [Lucide](https://lucide.dev) - Beautiful icons
- [React Hook Form](https://react-hook-form.com/) - Forms
- [Zod](https://zod.dev) - Validation

Inspired by modern React Native best practices and the open-source community.

---

## ⭐ Support

If you find Fabrico Template helpful, please give it a star on GitHub!

**Built with ❤️ for the React Native community**
