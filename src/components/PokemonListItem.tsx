import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePokemonDetail } from '@api/pokeApi';
import { useIsFavorite, useIsFavoriteToggling, useToggleFavorite } from '@hooks/useFavorites';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';
import { getTypeColor, colors } from '@theme/colors';

interface PokemonListItemProps {
  name: string;
  onPress: () => void;
  index?: number;
}

export const PokemonListItem = React.memo(({ name, onPress, index = 0 }: PokemonListItemProps) => {
  const { data: pokemon, isLoading, error } = usePokemonDetail(name);
  const isFavorite = useIsFavorite(name);
  const isFavoriteToggling = useIsFavoriteToggling(name);
  const { toggleFavorite } = useToggleFavorite();

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(name);
  }, [name, toggleFavorite]);

  if (isLoading) {
    return (
      <View style={styles.skeletonItem}>
        <Skeleton width={76} height={76} borderRadius={18} />
        <View style={styles.skeletonContent}>
          <Skeleton width="55%" height={18} borderRadius={6} style={{ marginBottom: 10 }} />
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Skeleton width={48} height={20} borderRadius={8} />
            <Skeleton width={48} height={20} borderRadius={8} />
          </View>
        </View>
      </View>
    );
  }

  if (error || !pokemon) return null;

  const primaryType = pokemon.types[0]?.type?.name || 'normal';
  const themeColor = getTypeColor(primaryType);
  const spriteUrl =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default ||
    '';

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInDown.duration(400).delay(Math.min(index, 10) * 50)}>
      <Card
        onPress={onPress}
        pokemonColor={themeColor}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        favoriteLoading={isFavoriteToggling}
      >
        <Card.Image source={spriteUrl} />
        <Card.Content>
          <Card.Title>{pokemon.name}</Card.Title>
          <Card.BadgeRow>
            {pokemon.types.map((t: any) => (
              <Card.Badge key={t.type.name} text={t.type.name} />
            ))}
          </Card.BadgeRow>
        </Card.Content>
        <Card.Number num={pokemon.id} />
      </Card>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
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
});
