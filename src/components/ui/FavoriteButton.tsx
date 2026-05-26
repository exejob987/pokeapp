import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { colors, withAlpha } from '@theme/colors';
import { AppLoader } from './AppLoader';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'transparent';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Reusable FavoriteButton component.
 * Renders a heart icon that toggles between filled and empty states.
 * Uses optimistic UI: the toggle callback should be wired to useFavorites().toggleFavorite.
 */
export const FavoriteButton = ({
  isFavorite,
  onToggle,
  size = 'medium',
  variant = 'transparent',
  style,
  disabled = false,
  loading = false,
}: FavoriteButtonProps) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 26 : 22;

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = useCallback(() => {
    if (disabled || loading) return;

    scale.value = withSequence(
      withSpring(0.82, { damping: 14, stiffness: 520 }),
      withSpring(1.14, { damping: 14, stiffness: 520 }),
      withSpring(1, { damping: 14, stiffness: 520 })
    );
    rotation.value = withSequence(
      withSpring(-12, { damping: 16, stiffness: 420 }),
      withSpring(8, { damping: 16, stiffness: 420 }),
      withSpring(0, { damping: 16, stiffness: 420 })
    );
    onToggle();
  }, [disabled, loading, onToggle, rotation, scale]);

  return (
    <AnimatedTouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'filled' && styles.filledButton,
        variant === 'transparent' && styles.transparentButton,
        { opacity: disabled ? 0.5 : 1 },
        animatedStyle,
        style,
      ]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityRole="button"
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={isFavorite ? '#F43F5E' : colors.textWhite}
      />
      {loading && (
        <AppLoader size="small" fullScreen overlayColor={withAlpha('#000000', 0.28)} />
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.3),
  },
  filledButton: {
    backgroundColor: withAlpha('#FFFFFF', 0.94),
    borderColor: withAlpha('#E2E8F0', 0.9),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  transparentButton: {
    backgroundColor: withAlpha('#FFFFFF', 0.16),
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
