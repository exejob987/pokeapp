import React, { createContext, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, ViewStyle, ImageStyle, TextStyle, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { blurActiveWebElement } from '@utils/webAccessibility';
import { AppLoader } from './AppLoader';

interface CardContextType {
  pokemonColor: string;
  isFavorite: boolean;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card sub-components must be rendered within a <Card /> component');
  }
  return context;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  pokemonColor?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  favoriteLoading?: boolean;
  style?: ViewStyle;
}

export const Card = ({
  children,
  onPress,
  pokemonColor = '#E2E8F0',
  isFavorite = false,
  onToggleFavorite,
  favoriteLoading = false,
  style,
}: CardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.94, { damping: 14, stiffness: 350 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 350 });
  }, []);

  const handlePress = useCallback(() => {
    blurActiveWebElement();
    onPress?.();
  }, [onPress]);

  return (
    <CardContext.Provider value={{ pokemonColor, isFavorite }}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, { marginVertical: 6, marginHorizontal: 16 }]}
      >
        <View style={[styles.card, style]}>
          <LinearGradient
            colors={[`${pokemonColor}15`, colors.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.contentWrapper}>
            {children}
          </View>
          {onToggleFavorite ? (
            <Pressable
              style={styles.favIndicator}
              disabled={favoriteLoading}
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteLoading ? <AppLoader size="small" overlayColor="transparent" /> : <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>}
            </Pressable>
          ) : isFavorite ? (
            <View style={styles.favIndicator}>
              <Text style={styles.favIcon}>❤️</Text>
            </View>
          ) : null}
        </View>
      </AnimatedPressable>
    </CardContext.Provider>
  );
};

interface CardImageProps {
  source: string;
  style?: ImageStyle;
}

Card.Image = function CardImage({ source, style }: CardImageProps) {
  const { pokemonColor } = useCardContext();
  return (
    <View style={[styles.imageContainer, { backgroundColor: `${pokemonColor}18` }]}>
      <Image
        source={source}
        style={[styles.image, style]}
        contentFit="contain"
        transition={200}
        recyclingKey={source}
      />
    </View>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Card.Content = function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.contentColumn, style]}>{children}</View>;
};

interface CardTitleProps {
  children: string;
  style?: TextStyle;
}

Card.Title = function CardTitle({ children, style }: CardTitleProps) {
  return (
    <Text style={[styles.title, style]} numberOfLines={1}>
      {children.charAt(0).toUpperCase() + children.slice(1)}
    </Text>
  );
};

interface CardBadgeProps {
  text: string;
  color?: string;
  style?: ViewStyle;
}

Card.Badge = function CardBadge({ text, color, style }: CardBadgeProps) {
  const { pokemonColor } = useCardContext();
  const badgeColor = color || pokemonColor;
  return (
    <View style={[styles.badge, { backgroundColor: badgeColor }, style]}>
      <Text style={styles.badgeText}>{text.toUpperCase()}</Text>
    </View>
  );
};

interface CardBadgeRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Card.BadgeRow = function CardBadgeRow({ children, style }: CardBadgeRowProps) {
  return <View style={[styles.badgeRow, style]}>{children}</View>;
};

interface CardNumberProps {
  num: number;
  style?: TextStyle;
}

Card.Number = function CardNumber({ num, style }: CardNumberProps) {
  const formattedNum = `#${String(num).padStart(3, '0')}`;
  return <Text style={[styles.number, style]}>{formattedNum}</Text>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    boxShadow: '0px 8px 18px rgba(30, 41, 59, 0.08)',
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  contentWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    borderRadius: 18,
    padding: 8,
    marginRight: 14,
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    transform: [{ translateY: -4 }],
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    ...typography.overline,
  },
  number: {
    ...typography.label,
    color: colors.textLight,
    position: 'absolute',
    top: 14,
    right: 16,
  },
  favIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    minWidth: 20,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 14,
  },
});
