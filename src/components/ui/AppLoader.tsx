import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, withAlpha } from '@theme/colors';

interface AppLoaderProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
  overlayColor?: string;
}

export const AppLoader = ({
  size = 'small',
  fullScreen = false,
  overlayColor = withAlpha('#0F172A', 0.22),
}: AppLoaderProps) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, { backgroundColor: overlayColor }]}>
      <ActivityIndicator size={size} color={colors.textWhite} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 99,
  },
});
