// components/cards/SavedGrantBox.tsx
import { ThemedText } from "@/components/themed-text";
import type { Grant } from "@/context/SavedGrantsContext";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

function shortMoney(n?: string | number) {
  if (n == null) return "";
  const x = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(x)) return "";
  if (x >= 1_000_000) return `$${Math.round(x / 100_000) / 10}M`;
  if (x >= 1_000) return `$${Math.round(x / 1_000)}K`;
  return `$${x}`;
}

export default function SavedGrantBox({
  grant,
  onPressApply,
}: {
  grant: Grant;
  onPressApply?: () => void;
}) {
  const theme = useTheme() as any;

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.topLeft}>
        <ThemedText type="label" numberOfLines={2} style={{ maxWidth: "85%" }}>
          {grant.title}
        </ThemedText>
        <ThemedText type="body" style={{ opacity: 0.8 }}>
          {shortMoney(grant.fundingAmount)}
        </ThemedText>
      </View>

      <Pressable
        onPress={onPressApply}
        style={({ pressed }) => [
          styles.applyBtn,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <ThemedText type="label" style={{ color: "#fff" }}>
          Apply
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexBasis: "48%", // 2 per row with even spacing
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginBottom: 12,
    minHeight: 120,
    overflow: "hidden",
  },
  topLeft: { gap: 4 },
  applyBtn: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "#6741FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
