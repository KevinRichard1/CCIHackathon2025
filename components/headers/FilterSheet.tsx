// components/headers/FilterSheet.tsx
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export type FilterKey = "amount" | "dueDate" | "estimatedAwardDate" | null;

type FilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (sortBy: FilterKey, direction: "asc" | "desc") => void;
  initialSortBy?: FilterKey;
  initialDirection?: "asc" | "desc";
};

export default function FilterSheet({
  visible,
  onClose,
  onApply,
  initialSortBy = null,
  initialDirection = "desc",
}: FilterSheetProps) {
  const theme = useTheme() as any;
  const [sortBy, setSortBy] = useState<FilterKey>(initialSortBy);
  const [direction, setDirection] = useState<"asc" | "desc">(initialDirection);

  // Reset state when re-opened
  useMemo(() => {
    if (visible) {
      setSortBy(initialSortBy ?? null);
      setDirection(initialDirection ?? "desc");
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.grabber} />

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText type="heading" style={{ marginBottom: 12 }}>
              Filter & Sort
            </ThemedText>

            <ThemedText type="subheading" style={{ marginBottom: 8 }}>
              Sort by
            </ThemedText>

            <View style={styles.row}>
              <Radio
                label="Grant amount"
                selected={sortBy === "amount"}
                onPress={() => setSortBy("amount")}
              />
              <Radio
                label="Due date"
                selected={sortBy === "dueDate"}
                onPress={() => setSortBy("dueDate")}
              />
            </View>
            <View style={[styles.row, { marginTop: 8 }]}>
              <Radio
                label="Estimated award date"
                selected={sortBy === "estimatedAwardDate"}
                onPress={() => setSortBy("estimatedAwardDate")}
              />
              <Radio
                label="None"
                selected={sortBy === null}
                onPress={() => setSortBy(null)}
              />
            </View>

            <ThemedText
              type="subheading"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              Direction
            </ThemedText>
            <View style={styles.row}>
              <Radio
                label="Descending"
                selected={direction === "desc"}
                onPress={() => setDirection("desc")}
              />
              <Radio
                label="Ascending"
                selected={direction === "asc"}
                onPress={() => setDirection("asc")}
              />
            </View>

            <View style={{ height: 20 }} />

            <View style={styles.actionsRow}>
              <Pressable
                onPress={onClose}
                style={[styles.btn, styles.btnOutline]}
              >
                <ThemedText type="label" style={styles.btnOutlineText}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => {
                  onApply(sortBy, direction);
                  onClose();
                }}
                style={[styles.btn, styles.btnPrimary]}
              >
                <ThemedText type="label" style={styles.btnPrimaryText}>
                  Apply
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Radio({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.radio}>
      <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <ThemedText type="body">{label}</ThemedText>
    </Pressable>
  );
}

const SHEET_RADIUS = 16;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: Platform.select({ ios: 24, default: 16 }),
    maxHeight: "70%",
  },
  grabber: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(127,127,127,0.35)",
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#6741FF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#6741FF",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "transparent",
  },
  btnOutlineText: {
    color: "#11181C",
  },
  btnPrimary: {
    backgroundColor: "#6741FF",
  },
  btnPrimaryText: {
    color: "#fff",
  },
});
