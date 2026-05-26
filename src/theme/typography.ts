import { Platform } from 'react-native';

const defaultFontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily: defaultFontFamily,
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  h1: {
    fontFamily: defaultFontFamily,
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: defaultFontFamily,
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: defaultFontFamily,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: defaultFontFamily,
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
  bodyStrong: {
    fontFamily: defaultFontFamily,
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  label: {
    fontFamily: defaultFontFamily,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  caption: {
    fontFamily: defaultFontFamily,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  overline: {
    fontFamily: defaultFontFamily,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};
