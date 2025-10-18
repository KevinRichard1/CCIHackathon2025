/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from "@react-navigation/native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof useTheme>["colors"]
) {
  const theme = useTheme();

  if (props.light || props.dark) {
    return theme.dark ? props.dark : props.light;
  }

  return theme.colors[colorName];
}
