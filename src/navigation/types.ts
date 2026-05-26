import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { pokemonIdOrName: string; fallbackColor?: string };
  Favorites: undefined;
};

export type PokemonListScreenProps = NativeStackScreenProps<RootStackParamList, 'PokemonList'>;
export type PokemonDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;
export type FavoritesScreenProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
