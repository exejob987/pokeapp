import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { usePokemonDetail } from '@api/pokeApi';
import { PokemonDetail } from '@components/PokemonDetail';
import { AppLoader } from '@components/ui/AppLoader';
import { Skeleton } from '@components/ui/Skeleton';
import { useIsFavorite, useIsFavoriteToggling, useToggleFavorite } from '@hooks/useFavorites';
import { colors, getTypeColor, getTypeGradient, mixColors } from '@theme/colors';
import { typography } from '@theme/typography';
import { PokemonDetailHero } from '@components/PokemonDetailHero';
import { PokemonDetailMetricsRow } from '@components/PokemonDetailMetricsRow';
import { PokemonDetailTopActions } from '@components/PokemonDetailTopActions';

export const PokemonDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { height: screenHeight } = useWindowDimensions();
  const { pokemonIdOrName } = route.params;

  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(pokemonIdOrName);
  const favoriteLookupName = pokemon?.name ?? String(pokemonIdOrName);
  const isFavorite = useIsFavorite(favoriteLookupName);
  const isAnyFavoriteToggling = useIsFavoriteToggling();
  const isFavoriteToggling = useIsFavoriteToggling(favoriteLookupName);
  const { toggleFavorite } = useToggleFavorite();

  const floatAnim = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const sheetReveal = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    sheetReveal.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, [floatAnim, glowPulse, sheetReveal]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + glowPulse.value * 0.35,
    transform: [{ scale: 1 + glowPulse.value * 0.08 }],
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sheetReveal.value,
    transform: [{ translateY: (1 - sheetReveal.value) * 24 }],
  }));

  const primaryType = pokemon?.types[0]?.type?.name || 'normal';
  const secondaryType = pokemon?.types[1]?.type?.name || primaryType;
  const themeColor = getTypeColor(primaryType);
  const secondaryColor = getTypeColor(secondaryType);
  const gradient = getTypeGradient(primaryType);
  const spriteUrl =
    pokemon?.sprites.other?.['official-artwork']?.front_default || pokemon?.sprites.front_default || '';
  const isCompactScreen = screenHeight < 760;
  const heroHeight = isCompactScreen ? 400 : 468;
  const imageCardSize = isCompactScreen ? 208 : 232;
  const artworkSize = isCompactScreen ? 182 : 200;
  const imageBottomOffset = isCompactScreen ? -30 : -38;
  const cardTopPadding = isCompactScreen ? 40 : 60;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Skeleton width={120} height={36} borderRadius={8} />
        <Skeleton width={80} height={20} borderRadius={6} style={styles.loadingSubtitle} />
        <Skeleton width={200} height={200} borderRadius={100} style={styles.loadingArtwork} />
        <View style={styles.loadingSheet}>
          <Skeleton width="40%" height={24} borderRadius={8} style={styles.loadingSheetTitle} />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} width="100%" height={40} borderRadius={10} style={styles.loadingStatRow} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !pokemon) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Failed to Load Details</Text>
        <Text style={styles.errorSubtitle}>{error?.message || 'Something went wrong while retrieving pokemon stats.'}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            void refetch();
          }}
          accessibilityRole="button"
          accessibilityLabel="Retry loading Pokemon details"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={[gradient[0], gradient[1], mixColors(gradient[1], '#020617', 0.25)]}
      style={styles.mainContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        {isAnyFavoriteToggling && <AppLoader fullScreen size="large" />}
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
          <PokemonDetailTopActions
            onGoBack={() => navigation.goBack()}
            isFavorite={isFavorite}
            onToggleFavorite={() => toggleFavorite(pokemon.name)}
            isFavoriteToggling={isFavoriteToggling}
          />

          <PokemonDetailHero
            pokemon={pokemon}
            heroHeight={heroHeight}
            secondaryColor={secondaryColor}
            themeColor={themeColor}
            spriteUrl={spriteUrl}
            imageCardSize={imageCardSize}
            artworkSize={artworkSize}
            imageBottomOffset={imageBottomOffset}
            isCompactScreen={isCompactScreen}
            animatedGlowStyle={animatedGlowStyle}
            animatedImageStyle={animatedImageStyle}
          />

          <Animated.View style={[styles.detailsSheet, sheetAnimatedStyle, { paddingTop: cardTopPadding }]}>
            <PokemonDetailMetricsRow
              weight={pokemon.weight}
              height={pokemon.height}
              baseExperience={pokemon.base_experience}
            />
            <PokemonDetail.Types types={pokemon.types} />
            <PokemonDetail.Stats stats={pokemon.stats} themeColor={themeColor} />
            <PokemonDetail.Abilities abilities={pokemon.abilities} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 34,
  },
  detailsSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingHorizontal: 20,
    paddingTop: 108,
    paddingBottom: 40,
    marginTop: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.13,
    shadowRadius: 22,
    elevation: 14,
    zIndex: 4,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  loadingSubtitle: { marginTop: 8 },
  loadingArtwork: { alignSelf: 'center', marginTop: 24 },
  loadingSheet: { flex: 1, marginTop: 20 },
  loadingSheetTitle: { marginBottom: 20 },
  loadingStatRow: { marginBottom: 12 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  errorIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    ...typography.bodyStrong,
  },
});
