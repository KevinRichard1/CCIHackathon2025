// app/_layout.tsx
import FilterSheet, { FilterKey } from "@/components/headers/FilterSheet";
import Header from "@/components/headers/header";
import { RAISETheme } from "@/constants/theme";
import { SavedGrantsProvider } from "@/context/SavedGrantsContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<FilterKey>(null);
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const [fontsLoaded, error] = useFonts({
    "SFProDisplay-Bold": require("../assets/fonts/SFProDisplay-Bold.ttf"),
    "SFProDisplay-Semibold": require("../assets/fonts/SFProDisplay-Semibold.ttf"),
    "SFProDisplay-Medium": require("../assets/fonts/SFProDisplay-Medium.ttf"),
    "SFProRounded-Regular": require("../assets/fonts/SFProRounded-Regular.ttf"),
    "SFProRounded-Light": require("../assets/fonts/SFProRounded-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        value={colorScheme === "dark" ? RAISETheme.dark : RAISETheme.light}
      >
        <SavedGrantsProvider>
          {/* Global Header */}
          <Header onOpenFilter={() => setFilterOpen(true)} />

          {/* App Navigator */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>

          {/* Global Filter Sheet */}
          <FilterSheet
            visible={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={(s, dir) => {
              setSortBy(s);
              setDirection(dir);
              // TODO: Broadcast sort choice via context/store to lists/cards
            }}
            initialSortBy={sortBy}
            initialDirection={direction}
          />

          <StatusBar style="auto" />
        </SavedGrantsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
