export type ThemeName =
  'blue' | 'orange' | 'pink' | 'green' | 'yellow' | 'violet' | 'black';

export interface Theme {
  name: ThemeName;
  label: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  gradientStart: string;
  gradientEnd: string;
}
