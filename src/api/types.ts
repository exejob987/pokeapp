export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonTypeInfo {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStatInfo {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbilityInfo {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  abilities: PokemonAbilityInfo[];
  forms: NamedAPIResource[];
  sprites: PokemonSprites;
  stats: PokemonStatInfo[];
  types: PokemonTypeInfo[];
}

// Internal structures for simplified local states
export interface PokemonSearchResult {
  id: number;
  name: string;
  url: string;
}

export interface SearchIndex {
  pokemon: PokemonSearchResult[];
  lastUpdated: number;
}
