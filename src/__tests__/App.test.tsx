// FavoritesScreen.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { FavoritesScreen } from '../screens/FavoritesScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

let mockFavorites = ['pikachu', 'bulbasaur'];
let mockIsFavoriteToggling = false;

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
}));

jest.mock('@hooks/useFavorites', () => ({
    useFavorites: () => ({
        favorites: mockFavorites,
    }),

    useIsFavoriteToggling: () => mockIsFavoriteToggling,
}));

jest.mock('@components/PokemonListItem', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        PokemonListItem: ({ name, onPress }: any) => (
            <Text onPress={onPress}>{name}</Text>
        ),
    };
});

jest.mock('@components/ui/AppLoader', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        AppLoader: () => <Text>Loading...</Text>,
    };
});

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        Ionicons: ({ name }: any) => <Text>Icon-{name}</Text>,
    };
});

jest.mock('expo-linear-gradient', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        LinearGradient: View,
    };
});

jest.mock('react-native-reanimated', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        __esModule: true,
        default: {
            View: View,
        },
        FadeInDown: {
            duration: () => ({
                delay: () => {},
            }),
        },
    };
});

jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        SafeAreaView: View,
    };
});

describe('FavoritesScreen', () => {
    beforeEach(() => {
        mockFavorites = ['pikachu', 'bulbasaur'];
        mockIsFavoriteToggling = false;
        mockNavigate.mockClear();
        mockGoBack.mockClear();
    });

    it('renders favorite pokemons', () => {
        const { getByText } = render(<FavoritesScreen />);

        expect(getByText('pikachu')).toBeTruthy();
        expect(getByText('bulbasaur')).toBeTruthy();
    });

    it('navigates to pokemon detail when pokemon pressed', () => {
        const { getByText } = render(<FavoritesScreen />);

        fireEvent.press(getByText('pikachu'));

        expect(mockNavigate).toHaveBeenCalledWith(
            'PokemonDetail',
            {
                pokemonIdOrName: 'pikachu',
            }
        );
    });

    it('goes back when back button pressed', () => {
        const { getByLabelText } = render(<FavoritesScreen />);

        fireEvent.press(getByLabelText('Go back'));

        expect(mockGoBack).toHaveBeenCalled();
    });

    it('renders empty state when there are no favorites', () => {
        mockFavorites = [];
        const { getByText, queryByText } = render(<FavoritesScreen />);

        expect(getByText("You don't have any favorites yet")).toBeTruthy();
        expect(queryByText('pikachu')).toBeNull();
    });

    it('renders loading loader when favorites are toggling', () => {
        mockIsFavoriteToggling = true;
        const { getByText } = render(<FavoritesScreen />);

        expect(getByText('Loading...')).toBeTruthy();
    });

    it('shows correct values in KPI cards', () => {
        const { getByText } = render(<FavoritesScreen />);

        // We have 2 favorites in mockFavorites
        expect(getByText('2')).toBeTruthy();
        expect(getByText('Ready')).toBeTruthy();
    });

    it('shows collection as Empty when there are no favorites', () => {
        mockFavorites = [];
        const { getByText } = render(<FavoritesScreen />);

        expect(getByText('0')).toBeTruthy();
        expect(getByText('Empty')).toBeTruthy();
    });
});