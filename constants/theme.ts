/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// constants/theme.ts

// constants/theme.ts
import { Platform } from "react-native";

export const FontFamilies = Platform.select({
  ios: {
    heading: "SFProDisplay-Bold",
    subheading: "SFProDisplay-Semibold",
    body: "SFProRounded-Regular",
    label: "SFProDisplay-Medium",
    subtle: "SFProRounded-Light",
  },
  default: {
    heading: "SFProDisplay-Bold",
    subheading: "SFProDisplay-Semibold",
    body: "SFProRounded-Regular",
    label: "SFProDisplay-Medium",
    subtle: "SFProRounded-Light",
  },
  web: {
    heading: "'SF Pro Display', sans-serif",
    subheading: "'SF Pro Display', sans-serif",
    body: "'SF Pro Rounded', sans-serif",
    label: "'SF Pro Display', sans-serif",
    subtle: "'SF Pro Rounded', sans-serif",
  },
});

export const RAISETheme = {
  light: {
    dark: false,
    colors: {
      text: "#11181C",
      background: "#FFFFFF",
      primary: "#6741FF",
      accent: "#CDF202",
      icon: "#687076",
      tabIconDefault: "#687076",
      tabIconSelected: "#6741FF",
      card: "#FFFFFF",
      border: "#E5E5E5",
      notification: "#6741FF",
    },
    // 👇 React Navigation expected shape
    fonts: {
      regular: { fontFamily: FontFamilies.body, fontWeight: "400" as const },
      medium: { fontFamily: FontFamilies.label, fontWeight: "500" as const },
      bold: { fontFamily: FontFamilies.heading, fontWeight: "700" as const },
      heavy: { fontFamily: FontFamilies.heading, fontWeight: "800" as const }, // or subheading + "600"
    },
    // 👇 keep your custom variants available to components
    typography: FontFamilies,
  },
  dark: {
    dark: true,
    colors: {
      text: "#FFFFFF",
      background: "#212121",
      primary: "#6741FF",
      accent: "#CDF202",
      icon: "#9BA1A6",
      tabIconDefault: "#9BA1A6",
      tabIconSelected: "#CDF202",
      card: "#212121",
      border: "#333333",
      notification: "#CDF202",
    },
    fonts: {
      regular: { fontFamily: FontFamilies.body, fontWeight: "400" as const },
      medium: { fontFamily: FontFamilies.label, fontWeight: "500" as const },
      bold: { fontFamily: FontFamilies.heading, fontWeight: "700" as const },
      heavy: { fontFamily: FontFamilies.heading, fontWeight: "800" as const },
    },
    typography: FontFamilies,
  },
};
