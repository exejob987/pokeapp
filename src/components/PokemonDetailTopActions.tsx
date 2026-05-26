import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoriteButton } from './ui/FavoriteButton';
import { withAlpha } from '@theme/colors';
import { blurActiveWebElement } from '@utils/webAccessibility';

interface PokemonDetailTopActionsProps {
  onGoBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isFavoriteToggling: boolean;
}

export const PokemonDetailTopActions = ({
  onGoBack,
  isFavorite,
  onToggleFavorite,
  isFavoriteToggling,
}: PokemonDetailTopActionsProps) => {
  const handleGoBack = () => {
    blurActiveWebElement();
    onGoBack();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleGoBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      </Pressable>
      <FavoriteButton
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        size="medium"
        variant="transparent"
        disabled={isFavoriteToggling}
        loading={isFavoriteToggling}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 10,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: withAlpha('#0F172A', 0.28),
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.45),
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
