import { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLoader } from '@components/ui/AppLoader';
import { useFavorites, useIsFavoriteToggling } from '@hooks/useFavorites';
import { PokemonListItem } from '@components/PokemonListItem';
import { colors, mixColors, withAlpha } from '@theme/colors';
import { typography } from '@theme/typography';
import { blurActiveWebElement } from '@utils/webAccessibility';

export const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { favorites } = useFavorites();
  const isAnyFavoriteToggling = useIsFavoriteToggling();

  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;

  const handlePressPokemon = useCallback(
    (name: string) => {
      blurActiveWebElement();
      navigation.navigate('PokemonDetail', { pokemonIdOrName: name });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <PokemonListItem name={item} onPress={() => handlePressPokemon(item)} index={index} />
    ),
    [handlePressPokemon]
  );

  return (
    <LinearGradient
      colors={[mixColors(colors.danger, '#0F172A', 0.32), mixColors(colors.danger, '#020617', 0.6)]}
      style={styles.safeContainer}
    >
      <SafeAreaView style={styles.safeAreaContent}>
        {isAnyFavoriteToggling && <AppLoader fullScreen size="large" />}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={() => {
                blurActiveWebElement();
                navigation.goBack();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Favorites</Text>
            </View>
          </View>

          <View style={styles.kpisRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{favorites.length}</Text>
              <Text style={styles.kpiLabel}>Favorites</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiValue}>{favorites.length > 0 ? 'Ready' : 'Empty'}</Text>
              <Text style={styles.kpiLabel}>Collection</Text>
            </View>
          </View>
        </View>

        <View style={styles.listSheet}>
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="heart-dislike-outline" size={30} color={colors.textLight} />
                </View>
                <Text style={styles.emptyTitle}>You don't have any favorites yet</Text>
                <Text style={styles.emptySubtitle}>
                  Tap the heart on any Pokémon to save it and quickly return to it later.
                </Text>
              </Animated.View>
            }
            showsVerticalScrollIndicator={false}
            numColumns={numColumns}
            key={`fav-cols-${numColumns}`}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  safeAreaContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withAlpha('#FFFFFF', 0.18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.35),
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h1,
    color: '#FFFFFF',
  },
  kpisRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: withAlpha('#FFFFFF', 0.14),
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.22),
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  kpiValue: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  kpiLabel: {
    ...typography.caption,
    color: withAlpha('#FFFFFF', 0.72),
    marginTop: 4,
  },
  listSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    marginTop: 6,
  },
  listContent: {
    paddingBottom: 32,
    paddingTop: 10,
  },
  emptyContainer: {
    paddingTop: 84,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
