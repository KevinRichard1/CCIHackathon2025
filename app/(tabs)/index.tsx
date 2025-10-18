// app/(tabs)/index.tsx  (Home) — 2-column infinite grid of saved grants
import SavedGrantBox from "@/components/cards/SavedGrantBox";
import { ThemedText } from "@/components/themed-text";
import { useSavedGrants } from "@/context/SavedGrantsContext";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const theme = useTheme() as any;
  const { saved } = useSavedGrants();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {saved.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText type="heading" style={{ opacity: 0.9 }}>
            No saved grants yet
          </ThemedText>
          <ThemedText type="body" style={{ opacity: 0.7, marginTop: 6 }}>
            Swipe right on a grant to shortlist it.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={saved}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => (
            <SavedGrantBox
              grant={item}
              onPressApply={() => {
                /* later */
              }}
            />
          )}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 24 },
  row: { justifyContent: "space-between" },
});
