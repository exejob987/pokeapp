import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import {
  PokemonDetail as PokemonDetailType,
  PokemonTypeInfo,
  PokemonStatInfo,
  PokemonAbilityInfo
} from '@api/types';
import { colors, getTypeColor, mixColors, withAlpha } from '@theme/colors';
import { typography } from '@theme/typography';

const MAX_STAT_VALUE = 220;
const SECTION_SPACING = 30;

const getStatAbbreviation = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'hp':
      return 'HP';
    case 'attack':
      return 'ATK';
    case 'defense':
      return 'DEF';
    case 'special-attack':
      return 'SATK';
    case 'special-defense':
      return 'SDEF';
    case 'speed':
      return 'SPD';
    default:
      return name.toUpperCase();
  }
};

const getStatBarColor = (value: number): string => {
  if (value >= 120) return '#10B981';
  if (value >= 80) return '#3B82F6';
  if (value >= 50) return '#F59E0B';
  return '#EF4444';
};

interface HeaderProps {
  pokemon: PokemonDetailType;
}

const Header = ({ pokemon }: HeaderProps) => {
  const primaryType = pokemon.types[0]?.type?.name ?? 'normal';
  const accent = getTypeColor(primaryType);

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.metaRow}>
        <View style={[headerStyles.typeChip, { backgroundColor: withAlpha('#FFFFFF', 0.22) }]}>
          <View style={[headerStyles.dot, { backgroundColor: accent }]} />
          <Text style={headerStyles.typeChipText}>{primaryType.toUpperCase()}</Text>
        </View>
        <Text style={headerStyles.number}>#{String(pokemon.id).padStart(3, '0')}</Text>
      </View>
      <Text style={headerStyles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
      <Text style={headerStyles.subtitle}>Pokemon Profile</Text>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: withAlpha('#FFFFFF', 0.28),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeChipText: {
    color: '#FFFFFF',
    ...typography.overline,
  },
  name: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.1,
    lineHeight: 48,
  },
  number: {
    ...typography.label,
    color: withAlpha('#FFFFFF', 0.82),
  },
  subtitle: {
    ...typography.body,
    color: withAlpha('#FFFFFF', 0.82),
  },
});

interface TypesProps {
  types: PokemonTypeInfo[];
}

const Types = ({ types }: TypesProps) => {
  return (
    <View style={typesStyles.section}>
      <Text style={typesStyles.sectionTitle}>Types</Text>
      <View style={typesStyles.row}>
        {types.map((t) => {
          const typeColor = getTypeColor(t.type.name);
          return (
            <LinearGradient
              key={t.type.name}
              colors={[withAlpha(typeColor, 0.16), withAlpha(typeColor, 0.06)]}
              style={[typesStyles.badge, { borderColor: withAlpha(typeColor, 0.35) }]}
            >
              <View style={[typesStyles.typeDot, { backgroundColor: typeColor }]} />
              <Text style={[typesStyles.badgeText, { color: mixColors(typeColor, '#0F172A', 0.32) }]}>
                {t.type.name.toUpperCase()}
              </Text>
            </LinearGradient>
          );
        })}
      </View>
    </View>
  );
};

const typesStyles = StyleSheet.create({
  section: {
    marginBottom: SECTION_SPACING,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    ...typography.label,
  },
});

interface AnimatedProgressBarProps {
  percent: number;
  value: number;
  accentColor: string;
}

const AnimatedProgressBar = ({ percent, value, accentColor }: AnimatedProgressBarProps) => {
  const widthAnim = useSharedValue(0);

  useEffect(() => {
    widthAnim.value = withTiming(percent, {
      duration: 950,
      easing: Easing.out(Easing.cubic),
    });
  }, [percent, widthAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value}%`,
  }));

  const endColor = mixColors(accentColor, getStatBarColor(value), 0.3);

  return (
    <Animated.View style={[statsStyles.progressFillWrap, animatedStyle]}>
      <LinearGradient colors={[accentColor, endColor]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={statsStyles.progressBar} />
      <View style={statsStyles.progressShine} />
    </Animated.View>
  );
};

interface StatsProps {
  stats: PokemonStatInfo[];
  themeColor?: string;
}

const Stats = ({ stats, themeColor }: StatsProps) => {
  const totalStats = stats.reduce((sum, s) => sum + s.base_stat, 0);
  const baseAccent = themeColor ?? colors.primary;

  return (
    <View style={statsStyles.section}>
      <View style={statsStyles.titleRow}>
        <Text style={statsStyles.sectionTitle}>Base Stats</Text>
        <View style={statsStyles.totalBadge}>
          <Text style={statsStyles.totalLabel}>TOTAL</Text>
          <Text style={statsStyles.totalValue}>{totalStats}</Text>
        </View>
      </View>

      <View style={statsStyles.container}>
        {stats.map((s) => {
          const percent = Math.min((s.base_stat / MAX_STAT_VALUE) * 100, 100);
          const rowAccent = mixColors(baseAccent, getStatBarColor(s.base_stat), 0.25);

          return (
            <View key={s.stat.name} style={statsStyles.rowCard}>
              <View style={statsStyles.rowTop}>
                <Text style={statsStyles.label}>{getStatAbbreviation(s.stat.name)}</Text>
                <Text style={[statsStyles.value, { color: rowAccent }]}>{s.base_stat}</Text>
              </View>
              <View style={statsStyles.progressBackground}>
                <AnimatedProgressBar percent={percent} value={s.base_stat} accentColor={rowAccent} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const statsStyles = StyleSheet.create({
  section: {
    marginBottom: SECTION_SPACING,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textSecondary,
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 6,
  },
  totalLabel: {
    ...typography.overline,
    color: colors.textLight,
  },
  totalValue: {
    ...typography.label,
    color: colors.textPrimary,
  },
  container: {
    gap: 10,
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  value: {
    ...typography.bodyStrong,
  },
  progressBackground: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFillWrap: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: '100%',
    backgroundColor: withAlpha('#FFFFFF', 0.26),
  },
});

interface AbilitiesProps {
  abilities: PokemonAbilityInfo[];
}

const Abilities = ({ abilities }: AbilitiesProps) => {
  return (
    <View style={abilitiesStyles.section}>
      <Text style={abilitiesStyles.sectionTitle}>Abilities</Text>
      <View style={abilitiesStyles.container}>
        {abilities.map((a) => (
          <View key={a.ability.name} style={abilitiesStyles.badge}>
            <Text style={abilitiesStyles.badgeText}>{a.ability.name.replace(/-/g, ' ').toUpperCase()}</Text>
            {a.is_hidden && (
              <View style={abilitiesStyles.hiddenTag}>
                <Text style={abilitiesStyles.hiddenText}>HIDDEN</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const abilitiesStyles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  hiddenTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  hiddenText: {
    ...typography.overline,
    color: '#D97706',
  },
});

export const PokemonDetail = {
  Header,
  Types,
  Stats,
  Abilities,
};
