import { useQuery, useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { storageService, STORAGE_KEYS } from '@storage/storageService';

const FAVORITES_QUERY_KEY = ['favorites'] as const;
const TOGGLE_FAVORITE_MUTATION_KEY = ['favorites', 'toggle'] as const;

// Function to fetch favorites (shared)
const fetchFavorites = async () => {
  const stored = await storageService.getItem<string[]>(STORAGE_KEYS.FAVORITES);
  if (!stored) return [];
  // Deduplicate and normalize persisted values to avoid cache drift across sessions.
  return Array.from(new Set(stored.map((name) => name.toLowerCase())));
};

// Hook for fetching the full list of favorites (used by FavoritesScreen)
export const useFavorites = () => {
  const { data: favorites = [] } = useQuery<string[]>({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavorites,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return { favorites };
};

// Granular hook for individual items (prevents re-renders of the whole list)
export const useIsFavorite = (pokemonName: string) => {
  const normalizedName = pokemonName.toLowerCase();
  const { data: isFavorite = false } = useQuery<string[], Error, boolean>({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: fetchFavorites,
    select: (favorites) => favorites.includes(normalizedName),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return isFavorite;
};

// Hook for toggling favorites
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationKey: TOGGLE_FAVORITE_MUTATION_KEY,
    mutationFn: async (pokemonName: string) => {
      const normalizedName = pokemonName.toLowerCase();
      // Use persisted source of truth to avoid double-toggle with optimistic cache updates.
      const currentFavorites = (await fetchFavorites()) || [];
      const updated = currentFavorites.includes(normalizedName)
        ? currentFavorites.filter((name) => name !== normalizedName)
        : [...currentFavorites, normalizedName];

      await storageService.setItem(STORAGE_KEYS.FAVORITES, updated);
      return updated;
    },
    onMutate: async (pokemonName) => {
      const normalizedName = pokemonName.toLowerCase();
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      const previousFavorites = queryClient.getQueryData<string[]>(FAVORITES_QUERY_KEY) || [];

      const nextFavorites = previousFavorites.includes(normalizedName)
        ? previousFavorites.filter((name) => name !== normalizedName)
        : [...previousFavorites, normalizedName];

      queryClient.setQueryData(FAVORITES_QUERY_KEY, nextFavorites);

      return { previousFavorites };
    },
    onError: (_err, _pokemonName, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(FAVORITES_QUERY_KEY, data);
    },
    onSettled: () => {
      // Ensure post-reload consistency by reconciling cache with persisted storage.
      void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  return {
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending,
  };
};

export const useIsFavoriteToggling = (pokemonName?: string) => {
  const normalizedName = pokemonName?.toLowerCase();
  const pendingMutationVariables = useMutationState({
    filters: { mutationKey: TOGGLE_FAVORITE_MUTATION_KEY, status: 'pending' },
    select: (mutation) => mutation.state.variables as string | undefined,
  });

  if (!normalizedName) return pendingMutationVariables.length > 0;
  return pendingMutationVariables.some(
    (variableName) => variableName?.toLowerCase() === normalizedName
  );
};


