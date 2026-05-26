import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePokemonInfiniteList } from '@api/pokeApi';
import { useIsFavoriteToggling } from '@hooks/useFavorites';
import { AppLoader } from '@components/ui/AppLoader';
import { SearchBar } from '@components/ui/SearchBar';
import { Skeleton } from '@components/ui/Skeleton';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { storageService, STORAGE_KEYS } from '@storage/storageService';
import pokeApi from '@api/pokeApi';
import { PokemonSearchResult } from '@api/types';
import { PokemonListItem } from '@components/PokemonListItem';
import { blurActiveWebElement } from '@utils/webAccessibility';

export const PokemonListScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const [searchIndex, setSearchIndex] = useState<PokemonSearchResult[]>([]);
  const isAnyFavoriteToggling = useIsFavoriteToggling();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePokemonInfiniteList();

  useEffect(() => {
    const initSearchIndex = async () => {
      try {
        const cachedIndex = await storageService.getItem<PokemonSearchResult[]>(
          STORAGE_KEYS.POKEMON_SEARCH_INDEX
        );
        if (cachedIndex && cachedIndex.length > 0) {
          setSearchIndex(cachedIndex);
          return;
        }

        const fullIndex = await pokeApi.fetchAllForIndex();
        await storageService.setItem(STORAGE_KEYS.POKEMON_SEARCH_INDEX, fullIndex);
        setSearchIndex(fullIndex);
      } catch (err) {
        console.error('[PokemonListScreen] Search index syncing failed:', err);
      }
    };

    initSearchIndex();
  }, []);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return searchIndex
      .filter((p) => p.name.includes(query) || String(p.id).includes(query))
      .slice(0, 40);
  }, [searchQuery, searchIndex]);

  const paginatedPokemon = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  const handlePressPokemon = useCallback(
    (name: string) => {
      blurActiveWebElement();
      navigation.navigate('PokemonDetail', { pokemonIdOrName: name });
    },
    [navigation]
  );

  const handleNavigateFavorites = useCallback(() => {
    blurActiveWebElement();
    navigation.navigate('Favorites');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: { name: string }, index: number }) => (
      <PokemonListItem name={item.name} onPress={() => handlePressPokemon(item.name)} index={index} />
    ),
    [handlePressPokemon]
  );

  const keyExtractor = useCallback((item: { name: string }) => item.name, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pokédex</Text>
          <Text style={styles.headerSubtitle}>Discover your favorites</Text>
          <View style={styles.searchBarSkeleton} />
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={() => (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.skeletonItem}>
              <Skeleton width={76} height={76} borderRadius={18} />
              <View style={styles.skeletonContent}>
                <Skeleton width="55%" height={18} borderRadius={6} style={{ marginBottom: 10 }} />
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Skeleton width={48} height={20} borderRadius={8} />
                  <Skeleton width={48} height={20} borderRadius={8} />
                </View>
              </View>
            </Animated.View>
          )}
          keyExtractor={(item) => String(item)}
          numColumns={numColumns}
          key={`skeleton-cols-${numColumns}`}
        />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.errorContent}>
          <Text style={styles.errorIcon}>😔</Text>
          <Text style={styles.errorTitle}>Connection Failed</Text>
          <Text style={styles.errorSubtitle}>
            {error?.message || 'Check your internet connection and try again.'}
          </Text>
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryButton}
            >
              <Pressable
                onPress={() => {
                  void refetch();
                }}
                style={styles.retryPressable}
                accessibilityRole="button"
                accessibilityLabel="Try loading Pokemon list again"
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeContainer}>
      {isAnyFavoriteToggling && <AppLoader fullScreen size="large" />}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Image
              source={require('../../assets/pokemon_logo.svg.png')}
              style={styles.headerLogo}
              contentFit="contain"
            />
            <Text style={styles.headerSubtitle}>
              {isSearchActive
                ? `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`
                : "Gotta catch 'em all!"}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={handleNavigateFavorites}
              accessibilityRole="button"
              accessibilityLabel="Open favorites screen"
              style={({ pressed }) => [styles.favoritesButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={styles.favoritesButtonIcon}>❤️</Text>
              <Text style={styles.favoritesButtonText}>Favorites</Text>
            </Pressable>
          </View>
        </View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or number..."
        />
      </View>

      <FlatList
        data={isSearchActive ? filteredResults : paginatedPokemon}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={
          isSearchActive
            ? undefined
            : () => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          !isSearchActive && isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          isSearchActive ? (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={styles.emptyTitle}>No Pokémon Found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching with a different name or number
              </Text>
            </Animated.View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        numColumns={numColumns}
        key={`list-cols-${numColumns}`}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.danger,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLogo: {
    width: 140,
    height: 50,
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  searchBarSkeleton: {
    height: 52,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    width: '100%',
  },
  listContent: {
    paddingBottom: 32,
    paddingTop: 4,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 22,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 14,
  },
  footerLoader: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  footerText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
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
    marginBottom: 28,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    boxShadow: '0px 6px 12px rgba(59, 130, 246, 0.3)',
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    ...typography.bodyStrong,
    textAlign: 'center',
  },
  retryPressable: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  favoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  favoritesButtonIcon: {
    fontSize: 16,
  },
  favoritesButtonText: {
    ...typography.bodyStrong,
    color: '#FFFFFF',
    fontSize: 14,
  },
  emptyContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
