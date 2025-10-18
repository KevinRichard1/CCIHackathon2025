// components/headers/Header.tsx
import { ThemedText } from "@/components/themed-text";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  onOpenFilter?: () => void;
  hidden?: boolean;
};

export default function Header({ onOpenFilter, hidden }: HeaderProps) {
  const theme = useTheme() as any;
  if (hidden) return null;

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.inner}>
        {/* Left: Logo + Title */}
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/penny_eye_tracking.png")}
            style={styles.logo}
          />
          <ThemedText type="heading" style={styles.brandText}>
            R A I S E
          </ThemedText>
        </View>

        {/* Right: Filter */}
        <Pressable
          onPress={onOpenFilter}
          hitSlop={12}
          style={({ pressed }) => [
            styles.iconBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Feather name="sliders" size={25} color={theme.colors.text} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  inner: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  brandText: {
    marginTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
