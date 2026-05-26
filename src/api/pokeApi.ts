import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { PokemonListResponse, PokemonDetail, PokemonSearchResult } from './types';

const PAGE_SIZE = 20;

export const pokeApi = {
  /**
   * Fetches a paginated slice of Pokemon resources.
   */
  fetchPokemonList: async (offset = 0): Promise<PokemonListResponse> => {
    const response = await apiClient.get<PokemonListResponse>(
      `pokemon?limit=${PAGE_SIZE}&offset=${offset}`
    );
    return response.data;
  },

  /**
   * Fetches detailed data for a specific Pokemon by name or ID.
   */
  fetchPokemonDetail: async (idOrName: string | number): Promise<PokemonDetail> => {
    const response = await apiClient.get<PokemonDetail>(`pokemon/${idOrName}`);
    return response.data;
  },

  /**
   * Fetches lightweight info for ALL Pokemon (used for offline index & real-time search).
   * This is extremely fast as it returns only names and basic resource URLs.
   */
  fetchAllForIndex: async (): Promise<PokemonSearchResult[]> => {
    const response = await apiClient.get<PokemonListResponse>('pokemon?limit=1500');
    return response.data.results.map((item) => {
      // Helper to parse the ID from the PokeAPI URL: https://pokeapi.co/api/v2/pokemon/{id}/
      const parts = item.url.split('/').filter(Boolean);
      const id = parseInt(parts[parts.length - 1], 10);
      return {
        id,
        name: item.name,
        url: item.url,
      };
    });
  },
};

// React Query Hooks

/**
 * Hook for fetching infinite scrolling Pokemon listings.
 */
export const usePokemonInfiniteList = () => {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: ({ pageParam }) => pokeApi.fetchPokemonList(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      try {
        const url = new URL(lastPage.next);
        const offset = url.searchParams.get('offset');
        return offset ? parseInt(offset, 10) : undefined;
      } catch {
        // Fallback parser if standard URL API fails in React Native environments
        const match = lastPage.next.match(/offset=(\d+)/);
        return match ? parseInt(match[1], 10) : undefined;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (data rarely changes)
  });
};

export const usePokemonDetail = (idOrName: string | number) => {
  return useQuery({
    queryKey: ['pokemon', 'detail', String(idOrName).toLowerCase()],
    queryFn: () => pokeApi.fetchPokemonDetail(String(idOrName).toLowerCase()),
    enabled: !!idOrName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default pokeApi;
