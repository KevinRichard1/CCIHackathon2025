import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import GrantCard from "@/components/cards/grantCard";
import { ThemedText } from "@/components/themed-text";
import { useSavedGrants } from "@/context/SavedGrantsContext";
import grants from "@/data/grants.json";

const PAGE_SIZE = 10;
const SWIPE_THRESHOLD = 120;
const EXIT_DURATION = 800;

export default function MatchScreen() {
  const { addGrant } = useSavedGrants();
  const [page, setPage] = useState(0); // 0-> first 10, 1-> next 10, ...
  const [index, setIndex] = useState(0); // pointer into current page

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const deck = useMemo(() => grants.slice(start, end), [start, end]);
  const hasCards = index < deck.length;
  const hasMorePages = end < grants.length;

  // Reanimated shared values for the TOP card
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const resetCard = () => {
    translateX.value = withSpring(0, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
    rotate.value = withSpring(0, { damping: 15 });
  };

  const advanceIndex = () => {
    setIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  };

  const flingOut = (dir: "left" | "right") => {
    const toX = dir === "right" ? 1200 : -1200;
    translateX.value = withTiming(toX, { duration: EXIT_DURATION }, () => {
      runOnJS(advanceIndex)();
    });
    translateY.value = withTiming(translateY.value + 40, {
      duration: EXIT_DURATION,
    });
  };

  const onSwipeRight = (g: any) => addGrant(g); // <<< save

  const pan = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
      rotate.value = (translateX.value / 300) * 0.25; // gentle tilt
    })
    .onEnd(() => {
      const dir =
        translateX.value > SWIPE_THRESHOLD
          ? "right"
          : translateX.value < -SWIPE_THRESHOLD
          ? "left"
          : null;

      if (dir) {
        if (dir === "right" && deck[index]) {
          runOnJS(onSwipeRight)(deck[index]); // ✅ actually save it
        }
        runOnJS(flingOut)(dir);
      } else {
        runOnJS(resetCard)();
      }
    });

  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotate.value}rad` },
    ],
  }));

  const onLoadMore = () => {
    if (!hasMorePages) return; // no more grants
    // move to next page of 10; reset swipe index
    setPage((p) => p + 1);
    setIndex(0);
    // reset animation positions
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.deckArea}>
        {/* Deck: render remaining from current index, back -> front */}
        {deck.slice(index).map((g, iFromTop) => {
          const isTop = iFromTop === 0;
          return (
            <Animated.View
              key={g.id}
              pointerEvents={isTop ? "auto" : "none"}
              style={[
                styles.cardSlot,
                { zIndex: 100 - iFromTop },
                isTop ? topCardStyle : undefined,
              ]}
            >
              {isTop ? (
                <GestureDetector gesture={pan}>
                  <Animated.View style={StyleSheet.absoluteFill}>
                    <GrantCard grant={g as any} />
                  </Animated.View>
                </GestureDetector>
              ) : (
                <GrantCard grant={g as any} />
              )}
            </Animated.View>
          );
        })}

        {/* CTA layer — behind the stack; becomes interactive when stack is empty */}
        <View style={[styles.ctaContainer, { zIndex: hasCards ? -1 : 1 }]}>
          <ThemedText type="heading" style={styles.ctaText}>
            {hasMorePages ? "Show more grants" : "No more grants"}
          </ThemedText>

          {hasMorePages ? (
            <Pressable onPress={onLoadMore} style={styles.ctaButton}>
              <ThemedText type="label" style={styles.ctaButtonText}>
                Load more
              </ThemedText>
            </Pressable>
          ) : (
            <View style={[styles.ctaButton, styles.ctaButtonDisabled]}>
              <ThemedText type="label" style={styles.ctaButtonTextDisabled}>
                No more grants
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deckArea: {
    width: "95%",
    height: "100%",
    position: "relative",
    alignItems: "stretch",
    justifyContent: "center",
    marginTop: -40,
  },
  cardSlot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // CTA (always present, centered; sits behind cards until stack clears)
  ctaContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { marginBottom: 12, opacity: 0.95 },
  ctaButton: {
    backgroundColor: "#6741FF", // solid purple pill
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 30,
  },
  ctaButtonText: { color: "#fff" },
  ctaButtonDisabled: {
    backgroundColor: "#B7A8FF",
  },
  ctaButtonTextDisabled: {
    color: "#F4F1FF",
  },
});
