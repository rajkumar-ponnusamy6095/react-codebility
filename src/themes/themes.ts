export type ThemeName =
  | "blue"
  | "orange"
  | "pink"
  | "green"
  | "yellow"
  | "violet";

export interface Theme {
  name: ThemeName;
  label: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  gradientStart: string;
  gradientEnd: string;
}

export const themes: Record<ThemeName, Theme> = {
  blue: {
    name: "blue",
    label: "Azure",
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    primaryLight: "#DBEAFE",
    gradientStart: "#2563EB",
    gradientEnd: "#06B6D4",
  },

  orange: {
    name: "orange",
    label: "Amber",
    primary: "#F97316",
    primaryDark: "#EA580C",
    primaryLight: "#FFEDD5",
    gradientStart: "#F97316",
    gradientEnd: "#F59E0B",
  },

  pink: {
    name: "pink",
    label: "Rose",
    primary: "#EC4899",
    primaryDark: "#DB2777",
    primaryLight: "#FCE7F3",
    gradientStart: "#EC4899",
    gradientEnd: "#F43F5E",
  },

  green: {
    name: "green",
    label: "Emerald",
    primary: "#10B981",
    primaryDark: "#059669",
    primaryLight: "#D1FAE5",
    gradientStart: "#10B981",
    gradientEnd: "#14B8A6",
  },

  yellow: {
    name: "yellow",
    label: "Gold",
    primary: "#EAB308",
    primaryDark: "#CA8A04",
    primaryLight: "#FEF9C3",
    gradientStart: "#EAB308",
    gradientEnd: "#F59E0B",
  },

  violet: {
    name: "violet",
    label: "Violet",
    primary: "#8B5CF6",
    primaryDark: "#7C3AED",
    primaryLight: "#EDE9FE",
    gradientStart: "#8B5CF6",
    gradientEnd: "#6366F1",
  },
};

export const DEFAULT_THEME: ThemeName = "blue";