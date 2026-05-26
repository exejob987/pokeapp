import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { PokemonDetail } from './PokemonDetail';
import { withAlpha } from '@theme/colors';
import { PokemonDetail as PokemonDetailModel } from '@api/types';

interface PokemonDetailHeroProps {
  pokemon: PokemonDetailModel;
  heroHeight: number;
  secondaryColor: string;
  themeColor: string;
  spriteUrl: string;
  imageCardSize: number;
  artworkSize: number;
  imageBottomOffset: number;
  isCompactScreen: boolean;
  animatedGlowStyle: any;
  animatedImageStyle: any;
}

export const PokemonDetailHero = ({
  pokemon,
  heroHeight,
  secondaryColor,
  themeColor,
  spriteUrl,
  imageCardSize,
  artworkSize,
  imageBottomOffset,
  isCompactScreen,
  animatedGlowStyle,
  animatedImageStyle,
}: PokemonDetailHeroProps) => {
  return (
    <View style={[styles.heroSection, { minHeight: heroHeight }]}>
      <Animated.View
        style={[
          styles.decorCircleLarge,
          animatedGlowStyle,
          { backgroundColor: withAlpha('#FFFFFF', 0.16) },
        ]}
      />
      <View
        style={[
          styles.decorCircleSmall,
          { backgroundColor: withAlpha(secondaryColor, 0.35) },
        ]}
      />

      <PokemonDetail.Header pokemon={pokemon} />

      <Animated.View
        style={[styles.imageContainer, animatedImageStyle, { bottom: imageBottomOffset }]}
      >
        <Animated.View
          style={[
            styles.imageGlow,
            animatedGlowStyle,
            {
              width: imageCardSize - 22,
              height: imageCardSize - 22,
              borderRadius: (imageCardSize - 22) / 2,
            },
          ]}
        />
        <LinearGradient
          colors={[withAlpha('#FFFFFF', 0.22), withAlpha('#FFFFFF', 0.08)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.artworkCard,
            {
              borderColor: withAlpha('#FFFFFF', 0.26),
              width: imageCardSize,
              height: imageCardSize,
              borderRadius: isCompactScreen ? 26 : 30,
            },
          ]}
        >
          <LinearGradient
            colors={[withAlpha(themeColor, 0.28), withAlpha('#FFFFFF', 0.08)]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.artworkBackdrop}
          />
          <Image
            source={spriteUrl}
            style={[styles.artwork, { width: artworkSize, height: artworkSize }]}
            contentFit="contain"
            transition={250}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 14,
    paddingTop: 40,
    paddingBottom: 160,
    position: 'relative',
    overflow: 'visible',
  },
  decorCircleLarge: {
    position: 'absolute',
    top: -86,
    right: -70,
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  decorCircleSmall: {
    position: 'absolute',
    top: 88,
    left: -34,
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 3,
    elevation: 10,
    paddingBottom: 70,
  },
  imageGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: withAlpha('#FFFFFF', 0.24),
  },
  artworkCard: {
    width: 232,
    height: 232,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.32,
    shadowRadius: 26,
    elevation: 18,
  },
  artworkBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  artwork: {
    width: 200,
    height: 200,
  },
});
