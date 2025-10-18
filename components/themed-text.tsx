import { useTheme } from "@react-navigation/native";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "heading" | "subheading" | "body" | "label" | "subtle" | "link";
};

export function ThemedText({ style, type = "body", ...rest }: ThemedTextProps) {
  const theme = useTheme() as any;
  const colors = theme.colors;
  const typography = theme.typography ?? {}; // our custom map

  const familyByType: Record<NonNullable<ThemedTextProps["type"]>, string> = {
    heading: typography.heading,
    subheading: typography.subheading,
    body: typography.body,
    label: typography.label,
    subtle: typography.subtle,
    link: typography.label, // links use label family, colored below
  };

  return (
    <Text
      style={[
        { color: colors.text, fontFamily: familyByType[type] },
        type === "heading" && styles.heading,
        type === "subheading" && styles.subheading,
        type === "label" && styles.label,
        type === "body" && styles.body,
        type === "subtle" && styles.subtle,
        type === "link" && [{ color: colors.primary }, styles.link],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, lineHeight: 34 },
  subheading: { fontSize: 20, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 22 },
  label: { fontSize: 16, lineHeight: 20 },
  subtle: { fontSize: 14, opacity: 0.7, lineHeight: 20 },
  link: { textDecorationLine: "underline" },
});
