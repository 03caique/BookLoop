/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Palette = {
  primary: '#66BB6A',
  secondary: '#26A69A',
  primaryDark: '#2E7D32',
  primaryLight: '#81C784',
  danger: '#D32F2F',
  white: '#FFFFFF',
  background: '#F8FAF8',
  textMuted: '#9E9E9E',
  border: '#E0E0E0',
  overlay: 'rgba(255,255,255,0.95)',

  borderLight: '#C8E6C9',
  placeholder: '#A5D6A7',
  tint: '#F1F8E9',
  textSecondary: '#558B2F',
  disabled: '#999999',
  overlayDark: 'rgba(0,0,0,0.7)',

  error: '#E53935',
  textPrimary: '#212121',
  textLabel: '#757575',
  tintLight: '#E8F5E9',

  gradientStart: '#E8F5E9',
  gradientMid: '#F1F8E9',
  blobSecondary: 'rgba(38, 166, 154, 0.12)',
  blobSecondaryOutline: 'rgba(38, 166, 154, 0.45)',
  blobPrimary: 'rgba(102, 187, 106, 0.18)',
  blobPrimaryOutline: 'rgba(46, 125, 50, 0.5)',

  formBackground: 'rgba(255, 255, 255, 0.9)',
  backButtonBackground: 'rgba(255,255,255,0.8)',

  menuBorder: '#EEEEEE',
  textDark: '#222222',
  textFaint: '#777777',

  warning: '#F9A825',
  textBody: '#333333',
  textMutedAlt: '#666666',

  successBg: '#E8F5E9',   
  dangerBg: '#FDECEA',
  warningBg: '#FFF8E1',
  neutralBg: '#F0F0F0',
  textSoft: '#555555',

  matchAccent: '#00C954',

  priorityHighBg: '#FFEBEE',
  priorityHighText: '#C62828',
  priorityMediumBg: '#FFF8E1',
  priorityMediumText: '#F57F17',
  priorityLowBg: '#E8F5E9',
  priorityLowText: '#2E7D32',
  priorityNeutralBg: '#F5F5F5',
  priorityNeutralText: '#757575',
  acceptAccent: '#43A047',

  imagePlaceholderBg: '#DCEDC8',
  badgeDoacaoBg: '#C8E6C9',
  badgeTrocaBg: '#DCEDC8',
  authorAccent: '#7CB342',
  viewerBg: 'rgba(0,0,0,0.95)',
  viewerOverlay: 'rgba(255,255,255,0.15)',
  viewerDotInactive: 'rgba(255,255,255,0.4)',

  textDarkAlt: '#2E2E2E',
  chatPlaceholder: '#9CBFA1',
  sendDisabled: '#A5C6A8',
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 28,
  xl: 24,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
};

export const FontSize = {
  xs: 10,
  sm: 15,
  md: 20,
  lg: 26,
};