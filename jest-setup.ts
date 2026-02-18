import "@testing-library/jest-native/extend-expect";

import "@testing-library/jest-native/extend-expect";


// Mocking Reanimated since it requires native modules
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Mock expo-font
jest.mock("expo-font", () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo module to avoid winter runtime issues
jest.mock("expo", () => ({
  registerRootComponent: jest.fn(),
}));

// Mock expo-asset
jest.mock("expo-asset", () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// Mock removed as path changed in newer RN versions
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

