import { blackTheme } from './black/black';
import { blueTheme } from './blue/blue';
import { greenTheme } from './green/green';
import { orangeTheme } from './orange/orange';
import { pinkTheme } from './pink/pink';
import { violetTheme } from './violet/violet';
import { yellowTheme } from './yellow/yellow';
import type { Theme, ThemeName } from './types';

export type { Theme, ThemeName } from './types';

export const themes: Record<ThemeName, Theme> = {
  black: blackTheme,
  blue: blueTheme,
  orange: orangeTheme,
  pink: pinkTheme,
  green: greenTheme,
  yellow: yellowTheme,
  violet: violetTheme,
};

export const DEFAULT_THEME: ThemeName = 'blue';
