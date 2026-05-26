import { Platform } from 'react-native';

export const blurActiveWebElement = (): void => {
  if (Platform.OS !== 'web') return;

  const activeEl = document.activeElement;
  if (activeEl instanceof HTMLElement) {
    activeEl.blur();
  }
};
