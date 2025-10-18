// components/cards/grantCard.tsx
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { backgroundImages } from "@/utils/backgroundImages";

type Grant = {
  id: number | string;
  agency: string;
  logo?: string;
  title: string;
  fundingAmount?: string | number;
  status?: string;
  applicationDueDate?: string;
  categories?: string[];
  description?: string;
  website?: string;
  contactInformation?: {
    email?: string;
    emailDescription?: string | null;
  } | null;
};

function shortMoney(n: string | number | undefined) {
  if (n == null) return "";
  const x = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(x)) return "";
  if (x >= 1_000_000) return `$${Math.round(x / 100_000) / 10}M`;
  if (x >= 1_000) return `$${Math.round(x / 1_000)}K`;
  return `$${x}`;
}

export default function GrantCard({
  grant,
  style,
}: {
  grant: Grant;
  style?: ViewStyle;
}) {
  const theme = useTheme() as any;
  const primary = theme.colors.primary;

  const category = grant.categories?.[0] ?? "Technology & Innovation";
  const bgImage =
    backgroundImages[category] ?? backgroundImages["Technology & Innovation"];

  // Flip progress: 0 = front, 1 = back
  const flip = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [0, 180]);
    const opacity = interpolate(flip.value, [0, 0.5, 1], [1, 0, 0]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 1], [-180, 0]);
    const opacity = interpolate(flip.value, [0, 0.5, 1], [0, 0, 1]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const flipToBack = () => {
    flip.value = withTiming(1, { duration: 350 });
  };

  const flipToFront = () => {
    flip.value = withTiming(0, { duration: 350 });
  };
  const isEnviro = category === "Environmental Sustainability";
  const titleColor = isEnviro ? theme.colors.text : "#fff";

  return (
    <View style={[styles.cardShadow, style]}>
      {/* FRONT */}
      <Animated.View style={[StyleSheet.absoluteFill, frontStyle]}>
        <ImageBackground
          source={{ uri: bgImage }}
          style={styles.card}
          imageStyle={styles.cardImage}
          resizeMode="cover"
        >
          {/* Top row: org name pill (left) + logo badge (right) */}
          <View style={styles.topRow}>
            <View style={styles.orgBadge}>
              <ThemedText
                type="label"
                style={{ color: "#11181C", fontSize: 18 }}
              >
                {grant.agency}
              </ThemedText>
            </View>

            <View style={styles.topRightRow}>
              {!!grant.logo && (
                <View style={styles.logoBadge}>
                  <Image
                    source={{ uri: grant.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Title — right-aligned, mid-card (your spec) */}
          <View style={styles.centerContent}>
            <ThemedText
              type="heading"
              style={{ color: titleColor, textAlign: "left", fontSize: 26 }}
            >
              {grant.title
                .split(" ")
                .map(
                  (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
                )
                .join(" ")}
            </ThemedText>
          </View>

          {/* Bottom gradient for readability */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.6)"]}
            style={styles.gradient}
          />

          {/* Bottom content */}
          <View style={styles.bottomContent}>
            {!!grant.fundingAmount && (
              <View style={styles.fundingPill}>
                <ThemedText type="label" style={styles.subline}>
                  Up to {shortMoney(grant.fundingAmount)} Available
                </ThemedText>
              </View>
            )}

            <View style={styles.pillsRow}>
              {!!grant.status && (
                <View style={[styles.pill, styles.pillFrost]}>
                  <ThemedText type="label" style={styles.pillDarkText}>
                    {grant.status}
                  </ThemedText>
                </View>
              )}
              {!!grant.applicationDueDate && (
                <View style={[styles.pill, styles.pillFrost]}>
                  <ThemedText type="label" style={styles.pillDarkText}>
                    Due{" "}
                    {new Date(grant.applicationDueDate).toLocaleDateString()}
                  </ThemedText>
                </View>
              )}
              {!!category && (
                <View style={[styles.pill, { backgroundColor: primary }]}>
                  <ThemedText type="label" style={{ color: "#fff" }}>
                    {category}
                  </ThemedText>
                </View>
              )}
            </View>
            {/* PLUS — bottom-right, floating */}
            <Pressable onPress={flipToBack} hitSlop={10} style={styles.plusFab}>
              <Feather name="info" size={30} color="#fff" />
            </Pressable>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* BACK (frosted glass, dark text) */}
      <Animated.View style={[StyleSheet.absoluteFill, backStyle]}>
        <ImageBackground
          source={{ uri: bgImage }}
          style={styles.card}
          imageStyle={styles.cardImage}
          resizeMode="cover"
        >
          {/* Frosted glass panel */}
          <View style={styles.backOverlay}>
            <BlurView
              intensity={28}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.backGlassTint} />
          </View>

          {/* Back content */}
          <View style={styles.backContent}>
            {/* Close (flip back) */}
            <View style={styles.backTopRow}>
              <Pressable
                onPress={flipToFront}
                hitSlop={10}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Feather name="x" size={26} color="#11181C" />
              </Pressable>
            </View>

            <ThemedText
              type="heading"
              style={[styles.backTitle, { color: "#11181C" }]}
            >
              About this Grant
            </ThemedText>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {!!grant.description && (
                <ThemedText
                  type="body"
                  style={{ color: "#11181C", lineHeight: 22 }}
                >
                  {grant.description}
                </ThemedText>
              )}

              <View style={{ height: 14 }} />

              {!!grant.website && (
                <View style={styles.infoRow}>
                  <Feather name="link" size={18} color="#11181C" />
                  <ThemedText
                    type="label"
                    numberOfLines={1}
                    style={{ color: "#11181C", marginLeft: 8 }}
                  >
                    {grant.website}
                  </ThemedText>
                </View>
              )}

              {!!grant.contactInformation?.email && (
                <View style={styles.infoRow}>
                  <Feather name="mail" size={18} color="#11181C" />
                  <ThemedText
                    type="label"
                    numberOfLines={1}
                    style={{ color: "#11181C", marginLeft: 8 }}
                  >
                    {grant.contactInformation.email}
                  </ThemedText>
                </View>
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const CARD_RADIUS = 30;

const styles = StyleSheet.create({
  cardShadow: {
    width: "100%",
    height: "100%",
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  card: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardImage: { borderRadius: CARD_RADIUS },

  topRow: {
    position: "absolute",
    top: 32,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 3,
  },
  topRightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // ORG name pill — white plush
  orgBadge: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  // LOGO badge — white rounded square
  logoBadge: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logo: { width: 40, height: 40 },

  centerContent: {
    marginTop: "34%",
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "flex-start", // right-aligning block per your spec
  },

  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    zIndex: 1,
  },
  bottomContent: {
    zIndex: 2,
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  subline: { color: "#CDF202" },

  pillsRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillFrost: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  pillDarkText: { color: "#11181C" },

  // BACK SIDE (frosted glass with dark text)
  backOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backGlassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  backContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  backTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  backTitle: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  plusFab: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
    borderRadius: 999,
    zIndex: 5,
  },
  fundingPill: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginTop: 4,
  },
});
