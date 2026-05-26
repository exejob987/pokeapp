# PokeApp

> **Nota**: Este proyecto es un challenge desarrollado para la empresa **deCampoaCampo**.

PokeApp is a modern Pokedex built with Expo + React Native + TypeScript.

It lets you:
- Browse Pokemon with infinite scroll.
- Search by name or number (with local cached index).
- Open a premium detail screen (hero header, floating artwork, animated stats).
- Save and manage favorites with offline persistence.

## Tech Stack

- Expo SDK 56
- React Native
- TypeScript
- React Navigation (native stack)
- TanStack Query + persistence
- AsyncStorage
- React Native Reanimated
- Expo Linear Gradient / Expo Image

## Requirements

- Node.js 22.13+ (recommended for React Native 0.85 tooling)
- npm
- Java 17 o superior (Requerido para compilar en Android)
- Expo Go app on your phone (optional, for device testing)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the Expo dev server:

```bash
npm run start
```

3. Run on a platform:

- Android:

```bash
npm run android
```

- iOS:

```bash
npm run ios
```

- Web:

```bash
npm run web
```

## Project Structure

## Project Structure

- `src/components/` → UI components (including `ui/` subfolder and composite components such as `PokemonDetail`).
- `src/hooks/` → Custom React hooks (e.g., `useFavorites`).
- `src/api/` → API client and typed models.
- `src/navigation/` → Navigation stack (`AppNavigator`).
- `src/screens/` → Screen components (list, detail, favorites).
- `src/storage/` → Persistence helpers (`storageService`).
- `src/theme/` → Design tokens (`colors`, `typography`).
- `src/utils/` → Utility functions (web accessibility, etc.).
- `src/index.ts` → Expo entry point registering the app.

## Main UX Notes

- Dynamic color themes based on Pokemon type.
- Animated favorite interactions.
- Floating layered layout on detail screen.
- Accessibility-focused interaction updates for web focus/navigation.

## Useful Commands

- Type-check:

```bash
npx tsc --noEmit
```

- Start Expo with cache reset:

```bash
npx expo start -c
```
