import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';

interface PokemonDetailMetricsRowProps {
  weight: number;
  height: number;
  baseExperience: number | null;
}

export const PokemonDetailMetricsRow = ({
  weight,
  height,
  baseExperience,
}: PokemonDetailMetricsRowProps) => {
  return (
    <View style={styles.metricsRow}>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>{(weight / 10).toFixed(1)} kg</Text>
        <Text style={styles.metricLabel}>Weight</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>{(height / 10).toFixed(1)} m</Text>
        <Text style={styles.metricLabel}>Height</Text>
      </View>
      <View style={styles.metricCard}>
        <Text style={styles.metricValue}>{baseExperience ?? '—'}</Text>
        <Text style={styles.metricLabel}>Base XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
    paddingHorizontal: 2,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  metricValue: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
