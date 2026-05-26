module.exports = {
    preset: '@react-native/jest-preset',

    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },

    transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|expo-font|expo-asset|expo-constants|expo-modules-core|@unimodules)/)',
    ],

    moduleNameMapper: {
        '^@api/(.*)$': '<rootDir>/src/api/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
        '^@screens/(.*)$': '<rootDir>/src/screens/$1',
        '^@storage/(.*)$': '<rootDir>/src/storage/$1',
        '^@theme/(.*)$': '<rootDir>/src/theme/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    },

    setupFilesAfterEnv: [],

    testEnvironment: 'node',
};